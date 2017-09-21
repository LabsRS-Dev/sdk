import { ProxyMessageCenter } from './proxy'
import { SelfClass } from '../observable'
import { Tool } from '../include'
import underscore from '../underscore'

const _ = underscore._

const logCord = '[SDK.Proxy.Client.Websocket.Go]'

const __key = 'proxy-client-websocket-go'
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

const ClientIOType = {
  SocketIO: 'Socket.io.client',   // 适用于Go服务器使用的Socket.IO
  EngineIO: 'Engine.io.client'    // 适用于Go服务器使用的Engine.IO
}

// ------------------------------------------------------------------------
// Class ProxyClientWebsocketPrivate
var __$p$ = {
  name: __key,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
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
  ClientIOType: ClientIOType,
  // ------------------ log -------------------------------------------------
  _traceLogEventsCount: function () {
    const _events = this.mc.getEvents()
    this.log(logCord, ' _events count = ' + _.keys(_events).length)
  },
  _traceLogCacheSendMessageCount: function () {
    this.log(logCord, ' cacheMessage count = ' + this.cacheSendMessage.length)
  },
  // -------------------------------------------------------------------------
  initialized: false, // 是否初始化配置
  config: {       // 包含的基本配置
    ip: '127.0.0.1',
    port: '8888',
    protocol: 'ws://',
    reqUrl: '',
    clientIOType: ClientIOType.SocketIO,              // 默认使用这种的Socket链接方式
    autoReconnectMaxRunTimes: Number.MAX_SAFE_INTEGER, // 设置重新连接的秒数,
    customSendEventDefine: 'sendMsgEvent',            // 定义核心交互的事件类型
    debug: true
  },
  getUrl: function () {
    var that = this
    var url = that.config.protocol + that.config.ip + ':' + that.config.port + that.config.reqUrl
    return url
  },
  getAutoReConnectSec: function () {
    return this.config.autoReconnectMaxRunTimes
  },
  isRunning: false,
  initWithConfig: function (inConfig = {}) {
    this.log(logCord, __key + ' call initWithConfig function ....')
    this.config = _.extend(this.config, inConfig)
    this.debug = this.config.debug
    this.initialized = true
  },
  run: function () {
    if (!this.initialized) {
      this.showInitializedTip()
      return
    }
    this.autoCreateWS()
  },
  // ------------------------------------------------
  // 消息交互的核心部分
  wsHandler: null,              // websocket 对象句柄

  // --------------- 核心消息 ------------------------
  cacheSendMessage: [],         // 缓存发送信息部分
  sendMessage: function (message, first = false) {   // 客户端向服务器发送消息
    var that = this
    if (!that.isRunning || !that.wsHandler) {
      that.cacheSendMessage.push(message)
      console.warn(logCord, 'WebSocket is not running .....')
      return
    }

    first ? that.cacheSendMessage.unshift(message) : that.cacheSendMessage.push(message)

    that._traceLogCacheSendMessageCount()
    _.each(that.cacheSendMessage, (curMessage) => {
      // 做好区分的准备
      if (that.config.clientIOType === ClientIOType.SocketIO) {
        that.wsHandler.send(that.config.customSendEventDefine, curMessage)
      } else if (that.config.clientIOType === ClientIOType.EngineIO) {
        that.wsHandler.send(curMessage)
      }

      that._traceLogEventsCount()
      that.mc.trigger(TypeMsg.OnSendMessageToServer, curMessage)
      that.cacheSendMessage.shift()
    })
    that._traceLogCacheSendMessageCount()
  },
  onReceiveMessage: function (message) {
    var that = this
    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnWSGetServerMessage, message)
  },
  // ---------------- 创建失败是回话被关闭交互 ----------------
  noticeCreateError: function (message) {
    var that = this
    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnCreateError, message)
  },
  noticeWSOpen: function (message) {
    var that = this
    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnWSOpen, message)
  },
  noticeWSClosed: function (message) {
    var that = this
    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnWSClose, message)
  },
  // --------------------------------------------------------
  // Websocket连接处理内核核心处理函数
  autoCWSTimesIndex: 0,  // 自动启动计数器
  autoReconnectMaxRunTimes: 3, // 最多尝试启动运行次数
  wsID: _.uniqueId(__key), // 客户端唯一ID
  showInitializedTip: function () {
    console.warn(logCord, initializedTip)
  },
  autoCreateWS: function () {
    var that = this
    that._pAutoCreateWS()
  },
  _pAutoCreateWS: function () {
    var that = this
    if (!that.isRunning) {
      // 尝试新的链接
      if (that.autoCWSTimesIndex <= that.autoReconnectMaxRunTimes) {
        that.log(logCord, 'try create new socket connect, port = ' + that.config.port)
        that.createWS()
      }
      ++that.autoCWSTimesIndex
    }
  },
  createWS: function () { // 建立Websocket 客户端
    var that = this
    if (that.config.clientIOType === ClientIOType.SocketIO) {
      that.__createWSWithSocketIO()
    } else if (that.config.clientIOType === ClientIOType.EngineIO) {
      that.__createWSWithEngineIO()
    }
  },
  // --------------------------------------------------------
  // 向服务器发送注册信息，测试返回
  __sendWSRegisterInfo: function () {
    const __agent = this
    __agent.sendMessage(JSON.stringify({
      'msg': {
        'wsid': __agent.wsID
      },
      'type': 'c_notice_id_Info'
    }))
  },
  // --------------------------------------------------------
  __createWSWithSocketIO: function () {
    const __agent = this
    var url = __agent.getUrl()
    __agent.log(logCord, 'create new socket connect, wsurl = ' + url)

    const warning = `
    This way use the Socket.IO client interface api, Please download it, and use the script in you web source
    see: https://github.com/socketio/socket.io-client
    `

    try {
      if (Tool.isUndefinedOrNull(window.io)) {
        return console.warn(logCord, warning)
      }

      var ws = window.io(url)
      ws.on('connect', () => {
        __agent.log(logCord, 'is connecting ...')
        __agent.wsHandler = ws
        __agent.isRunning = true

        // 广播自己已经连接上
        __agent.noticeWSOpen({ data: ws })

        // 向服务器发送注册信息，测试返回
        __agent.__sendWSRegisterInfo()
      })
      ws.on('message', (event, data) => {
        __agent.log(logCord, event, data)
        __agent.isRunning = true

        var msgPackage = ''
        // Decodeing 匹配大部分数据格式，进行处理
        if (Tool.isBlob(data)) {
          Tool.blobData2String(data, function (text) {
            msgPackage = text
            __agent.onReceiveMessage(msgPackage) // 按接口要求，尽量回传字符串
          })
          return
        }
        if (_.isObject(data)) {
          msgPackage = JSON.stringify(data)
          __agent.onReceiveMessage(msgPackage) // 按接口要求，尽量回传字符串
        } else if (_.isString(data)) {
          msgPackage = data
          __agent.onReceiveMessage(msgPackage) // 按接口要求，尽量回传字符串
        } else if (_.isNull(data)) {
          console.warn(logCord, 'cannot process null data obj ....')
        } else {
          console.warn(logCord, 'cannot process this message type ....')
        }
      })
      ws.on('event', (data) => {
        __agent.log(logCord, 'on ws.on("event")')
      })
      ws.on('disconnect', () => {
        try {
          __agent.log(logCord, 'onclose code = ')
        } catch (error) {}

        var tryCreateWS = () => {
          setTimeout(function () {
            __agent.autoCreateWS()
          }, __agent.getAutoReConnectSec())
        }
        __agent.isRunning = false

        // notice some message for others
        __agent.noticeWSClosed()
        tryCreateWS()
      })
    } catch (error) {
      __agent.log(logCord, error)
      __agent.isRunning = false
      // notice some message for others
      __agent.noticeCreateError({ errCode: error })
    }
  },
  __createWSWithEngineIO: function () {
    const __agent = this
    var url = __agent.getUrl()
    __agent.log(logCord, 'create new socket connect, wsurl = ' + url)
    const warning = `
    This way use the Engine.IO client interface api, Please download it, and use the script in you web source
    see: https://github.com/socketio/engine.io-client
    `

    try {
      if (Tool.isUndefinedOrNull(window.io)) {
        return console.warn(logCord, warning)
      }
      var ws = new window.eio.Socket(url)
      ws.on('open', () => {
        __agent.log(logCord, 'is connecting ...')
        __agent.wsHandler = ws
        __agent.isRunning = true

        ws.on('message', (data) => {
          __agent.isRunning = true
          __agent.log(logCord, data)

          var msgPackage = ''
          // Decodeing 匹配大部分数据格式，进行处理
          if (Tool.isBlob(data)) {
            Tool.blobData2String(data, function (text) {
              msgPackage = text
              __agent.onReceiveMessage(msgPackage) // 按接口要求，尽量回传字符串
            })
            return
          }
          if (_.isObject(data)) {
            msgPackage = JSON.stringify(data)
            __agent.onReceiveMessage(msgPackage) // 按接口要求，尽量回传字符串
          } else if (_.isString(data)) {
            msgPackage = data
            __agent.onReceiveMessage(msgPackage) // 按接口要求，尽量回传字符串
          } else {
            console.warn(logCord, 'cannot process this message type ....')
          }
        })
        ws.on('close', () => {
          try {
            __agent.log(logCord, 'onclose code = ')
          } catch (error) {}

          var tryCreateWS = () => {
            setTimeout(function () {
              __agent.autoCreateWS()
            }, __agent.getAutoReConnectSec())
          }
          __agent.isRunning = false

          // notice some message for others
          __agent.noticeWSClosed()
          tryCreateWS()
        })

        // 广播自己已经连接上
        __agent.noticeWSOpen({
          data: ws
        })

        // 向服务器发送注册信息，测试返回
        __agent.__sendWSRegisterInfo()
      })
    } catch (error) {
      __agent.log(logCord, error)
      __agent.isRunning = false
      // notice some message for others
      __agent.noticeCreateError({
        errCode: error
      })
    }
  }

}

// 批量处理注册及接收方式
_.each(TypeMsg, function (eventType, key, list) {
  var registerKey = 'register' + key
  var unregisterKey = 'unregister' + key

  __$p$[registerKey] = function (handler, one = false) {
    __$p$.mc.bind(eventType, handler, one)
  }
  __$p$[unregisterKey] = function (handler) {
    __$p$.mc.unbind(eventType, handler)
  }
})

var ProxyClientWebsocketForGo = SelfClass.extend(__$p$)

// -----------------------------------------------------------------------
// 统一的Client Websocket 处理, 用来与后台服务器的交互处理
//
// -----------------------------------------------
export {
  ProxyClientWebsocketForGo
}
