import { ProxyMessageCenter } from './proxy'
import { SelfClass } from '../observable'
import underscore from '../underscore'
import { Tool } from '../include'
const _ = underscore._

const logCord = '[SDK.Proxy.Client.Websocket.Python]'

const __key = 'proxy-client-websocket-python'
const __msgPrefix = __key + '-' + _.now() + _.random(1, Number.MAX_SAFE_INTEGER) + '-'
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
var __$p$ = {
  name: __key,
  mc: new ProxyMessageCenter(),
  getMsgHelper: () => {
    return __$p$.mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end = '') {
    if (__$p$.debug) {
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
    autoReconnectMaxRunTimes: Number.MAX_SAFE_INTEGER, // 设置重新连接的秒数,
    debug: true
  },
  getUrl: function () {
    var that = __$p$
    var url = that.config.protocol + that.config.ip + ':' + that.config.port + that.config.reqUrl
    return url
  },
  getAutoReConnectSec: () => {
    return __$p$.config.autoReconnectMaxRunTimes
  },
  isRunning: false,
  initWithConfig: function (inConfig = {}) {
    __$p$.log(logCord, __key + ' call initWithConfig function ....')
    __$p$.config = _.extend(__$p$.config, inConfig)
    __$p$.debug = __$p$.config.debug
    __$p$.initialized = true
  },
  run: function () {
    if (!__$p$.initialized) {
      __$p$.showInitializedTip()
      return
    }
    __$p$.autoCreateWS()
  },
  // ------------------------------------------------
  // 消息交互的核心部分
  wsHandler: null,              // websocket 对象句柄

  // --------------- 核心消息 ------------------------
  cacheSendMessage: [],         // 缓存发送信息部分
  sendMessage: (message, first = false) => {   // 客户端向服务器发送消息
    if (!__$p$.isRunning || !__$p$.wsHandler) {
      __$p$.cacheSendMessage.push(message)
      console.warn(logCord, 'WebSocket is not running .....')
      return
    }

    first ? __$p$.cacheSendMessage.unshift(message) : __$p$.cacheSendMessage.push(message)
    _.each(__$p$.cacheSendMessage, (curMessage) => {
      __$p$.wsHandler.send(curMessage)
      __$p$.mc.trigger(TypeMsg.OnSendMessageToServer, curMessage)
      __$p$.cacheSendMessage.shift()
    })
  },
  onReceiveMessage: (message) => {
    __$p$.mc.trigger(TypeMsg.OnWSGetServerMessage, message)
  },
  // ---------------- 创建失败是回话被关闭交互 ----------------
  noticeCreateError: (message) => {
    __$p$.mc.trigger(TypeMsg.OnCreateError, message)
  },
  noticeWSOpen: (message) => {
    __$p$.mc.trigger(TypeMsg.OnWSOpen, message)
  },
  noticeWSClosed: (message) => {
    __$p$.mc.trigger(TypeMsg.OnWSClose, message)
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
    __$p$._pAutoCreateWS()
  },
  _pAutoCreateWS: () => {
    if (!__$p$.isRunning) {
      // 尝试新的链接
      if (__$p$.autoCWSTimesIndex <= __$p$.autoReconnectMaxRunTimes) {
        __$p$.log(logCord, 'try create new socket connect, port = ' + __$p$.config.port)
        __$p$.createWS(__$p$.getUrl())
      }
      ++__$p$.autoCWSTimesIndex
    }
  },
  createWS: (url) => { // 建立Websocket 客户端
    var __agent = __$p$
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
            __agent.noticeWSOpen({ data: ws })

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
_.each(TypeMsg, (eventType, key, list) => {
  __$p$['register' + key] = (handler, one = false) => {
    __$p$.mc.bind(eventType, handler, one)
  }
  __$p$['unregister' + key] = (handler) => {
    __$p$.mc.unbind(eventType, handler)
  }
})

var ProxyClientWebsocketForPython = SelfClass.extend(__$p$)

// -----------------------------------------------------------------------
// 统一的Client Websocket 处理, 用来与后台服务器的交互处理
//
// -----------------------------------------------
export {
  ProxyClientWebsocketForPython
}
