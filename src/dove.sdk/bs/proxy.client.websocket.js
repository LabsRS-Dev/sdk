import { ProxyMessageCenter } from './proxy'
import { Class } from '../observable'
import underscore from '../underscore'
import { Tool } from '../include'
const _ = underscore._

const logCord = '[SDK.Proxy.Client.Websocket]'

const __key = 'proxy-client-websocket'
const __msgPrefix = __key + _.now() + _.random(1, Number.MAX_SAFE_INTEGER)
const TypeMsg = {
  OnCreateError: __msgPrefix + 'OnCreateError', // Websocket 创建失败
  OnWSOpen: __msgPrefix + 'OnWSOpen',          // WebSocket 创建并连接上
  OnWSClose: __msgPrefix + 'OnWSClose',        // WebSocket 意外关闭

  OnWSGetServerMessage: __msgPrefix + 'OnWSGetServerMessage',  // WebSocket 从服务器获取到信息
  OnSendMessageToServer: __msgPrefix + 'OnSendMessageToServer' // 向服务器发送信息
}

const initializedTip = `
You must use init(config) function first, the use listen to start!!!!
`

// ------------------------------------------------------------------------
// Class ProxyClientWebsocketPrivate
var ProxyClientWebsocketPrivate = {
  name: __key,
  mc: new ProxyMessageCenter(),
  getMsgHelper: () => {
    return this.mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end = '') {
    if (this.debug) {
      console.log(title, message, end)
    }
  },
  getInternalMessageType: function () {
    return TypeMsg
  },
  // -------------------------------------------------------------------------
  initialized: false, // 是否初始化配置
  config: {       // 包含的基本配置
    ip: '127.0.0.1',
    port: '8080',
    protocol: 'ws://',
    reqUrl: '/websocket',
    autoReconnectMaxRunTimes: Number.MAX_SAFE_INTEGER // 设置重新连接的秒数,
  },
  getUrl: function () {
    var that = this
    var url = that.protocol + that.ip + ':' + that.port + this.reqUrl
    return url
  },
  getAutoReConnectSec: () => {
    return this.config.autoReconnectMaxRunTimes
  },
  isRunning: false,
  initWithConfig: function (inConfig = {}) {
    this.log(logCord, __key + ' call initWithConfig function ....')
    this.config = _.extend(this.config, inConfig)
    this.initialized = true
  },
  run: function () {
    if (!this.initialized) {
      this.showInitializedTip()
      return
    }
    this.autoCreateWS(this.getUrl())
  },
  // ------------------------------------------------
  // 消息交互的核心部分
  wsHandler: null,              // websocket 对象句柄

  // --------------- 核心消息 ------------------------
  cacheSendMessage: [],         // 缓存发送信息部分
  sendMessage: (message, first = false) => {   // 客户端向服务器发送消息
    if (!this.isRunning || !this.wsHandler) {
      this.cacheSendMessage.push(message)
      console.warn(logCord, 'WebSocket is not running .....')
      return
    }

    first ? this.cacheSendMessage.unshift(message) : this.cacheSendMessage.push(message)
    _.each(this.cacheSendMessage, (curMessage) => {
      this.wsHandler.send(curMessage)
      this.mc.trigger(TypeMsg.OnSendMessageToServer, curMessage)
      this.cacheSendMessage.shift()
    })
  },
  onReceiveMessage: (message) => {
    this.mc.trigger(TypeMsg.OnWSGetServerMessage, message)
  },
  // ---------------- 创建失败是回话被关闭交互 ----------------
  noticeCreateError: (message) => {
    this.mc.trigger(TypeMsg.OnCreateError, message)
  },
  noticeWSOpen: (message) => {
    this.mc.trigger(TypeMsg.OnWSOpen, message)
  },
  noticeWSClosed: (message) => {
    this.mc.trigger(TypeMsg.OnWSClose, message)
  },
  // --------------------------------------------------------
  // Websocket连接处理内核核心处理函数
  autoCWSTimesIndex: 0,  // 自动启动计数器
  autoReconnectMaxRunTimes: 3, // 最多尝试启动运行次数
  wsID: '', // 客户端ID
  showInitializedTip: () => {
    console.warn(logCord, initializedTip)
  },
  autoCreateWS: () => {
    this._pAutoCreateWS()
  },
  _pAutoCreateWS: () => {
    if (!this.isRunning) {
      // 尝试新的链接
      if (this.autoCWSTimesIndex <= this.autoReconnectMaxRunTimes) {
        this.log(logCord, 'try create new socket connect, port = ' + this.config.port)
        this.createWS(this.getUrl())
      }
      ++this.autoCWSTimesIndex
    }
  },
  createWS: (url) => { // 建立Websocket 客户端
    var __agent = this
    var WebSocket = window.WebSocket || window.MozWebSocket
    __agent.log(logCord, 'create new socket connect, wsurl = ' + url)

    try {
      var ws = new WebSocket(url) // 启动监听服务
      if (ws) {
        // ==== onopen
        ws.onopen = function (evt) {
          var that = this
          __agent.wsHandler = this

          __agent.wsID = 'ws' + _.now() + _.random(1, 999999)

          if (that.readyState === 1) {
            __agent.log(logCord, 'is connecting ...')
            __agent.isRunning = true
            // 广播自己已经连接上
            __agent.noticeWSClosed({ data: ws })

            // 向服务器发送注册信息，测试返回
            __agent.sendMessage(JSON.stringify({
              'user_id': __agent.wsID,
              'msg_type': 'c_notice_id_Info'
            }))
          }
        }

        // ==== onmessage
        ws.onmessage = function (evt) {
          __agent.isRunning = true
          __agent.log(logCord, evt.data)

          var msgPackage = ''
          // Decodeing 匹配大部分数据格式，进行处理
          if (Tool.isBlob(evt.data)) {
            Tool.blobData2String(evt.data, function (text) {
              msgPackage = text
              __agent.onReceiveMessage(msgPackage) // 按接口要求，尽量回传字符串
            })
            return
          }
          if (_.isObject(evt.data)) {
            msgPackage = JSON.stringify(evt.data)
            __agent.onReceiveMessage(msgPackage) // 按接口要求，尽量回传字符串
          } else if (_.isString(evt.data)) {
            msgPackage = evt.data
            __agent.onReceiveMessage(msgPackage) // 按接口要求，尽量回传字符串
          } else {
            console.warn(logCord, 'cannot process this message type ....')
          }
        }

        // ===== onerror = function (evt) {
        ws.onerror = function (evt) {

        }

        // ==== onclose
        ws.onclose = function (evt) {
          try {
            __agent.log(logCord, 'onclose code = ' + evt)
          } catch (error) {}

          var tryCreateWS = () => {
            setTimeout(function () {
              __agent.autoCreateWS()
            }, __agent.getAutoReConnectSec())
          }
          __agent.isRunning = false

          // notice some message for others
          __agent.noticeWSClosed({ errCode: evt.code })
          tryCreateWS()
        }
      }
    } catch (error) {
      __agent.log(logCord, error)
      __agent.isRunning = false
      // notice some message for others
      __agent.noticeCreateError({ errCode: error })
    }
  }
  // --------------------------------------------------------

}

// 批量处理注册及接收方式
var __private = ProxyClientWebsocketPrivate
_.each(_.keys(TypeMsg), (eventType, key, list) => {
  __private['register' + key] = (handler, one = false) => {
    __private.mc.bind(eventType, handler, one)
  }
  __private['unregister' + key] = (handler) => {
    __private.mc.unbind(eventType, handler)
  }
})

var ProxyClientWebsocket = Class.extend(ProxyClientWebsocketPrivate)

// -----------------------------------------------------------------------
// 统一的Client Websocket 处理, 用来与后台服务器的交互处理
//
// -----------------------------------------------
export {
  ProxyClientWebsocket
}
