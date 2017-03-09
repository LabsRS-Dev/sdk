import { ProxyMessageCenter } from './proxy'
import { SelfClass } from '../observable'
import { Tool } from '../include'
import underscore from '../underscore'

const _ = underscore._

const logCord = '[SDK.Proxy.Client.Websocket.Node]'

const __key = 'proxy-client-websocket-node'
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
  SocketIO: 'Socket.io.client',   // 适用于Node服务器使用的Socket.IO
  EngineIO: 'Engine.io.client'    // 适用于Node服务器使用的Engine.IO
}

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
  ClientIOType: ClientIOType,
  // -------------------------------------------------------------------------
  initialized: false, // 是否初始化配置
  config: {       // 包含的基本配置
    ip: '127.0.0.1',
    port: '8888',
    protocol: 'http://',
    reqUrl: '',
    clientIOType: ClientIOType.SocketIO,              // 默认使用这种的Socket链接方式
    autoReconnectMaxRunTimes: Number.MAX_SAFE_INTEGER, // 设置重新连接的秒数,
    customSendEventDefine: 'sendMsgEvent',            // 定义核心交互的事件类型
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
      // 做好区分的准备
      if (__$p$.config.clientIOType === ClientIOType.SocketIO) {
        __$p$.wsHandler.send(__$p$.config.customSendEventDefine, curMessage)
      } else if (__$p$.config.clientIOType === ClientIOType.EngineIO) {
        __$p$.wsHandler.send(curMessage)
      }

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
        __$p$.createWS()
      }
      ++__$p$.autoCWSTimesIndex
    }
  },
  createWS: () => { // 建立Websocket 客户端
    const __agent = __$p$
    if (__agent.config.clientIOType === ClientIOType.SocketIO) {
      __$p$.__createWSWithSocketIO()
    } else if (__agent.config.clientIOType === ClientIOType.EngineIO) {
      __$p$.__createWSWithEngineIO()
    }
  },
  // --------------------------------------------------------
  __createWSWithSocketIO: () => {
    const __agent = __$p$
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
        __agent.wsID = ws.id
        __agent.isRunning = true

        // 广播自己已经连接上
        __agent.noticeWSOpen({ data: ws })

        // 向服务器发送注册信息，测试返回
        __agent.sendMessage(JSON.stringify({
          'user_id': __agent.wsID,
          'msg_type': 'c_notice_id_Info'
        }))
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
  __createWSWithEngineIO: () => {
    const __agent = __$p$
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
        __agent.wsID = ws.id
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
        __agent.sendMessage(JSON.stringify({
          'user_id': __agent.wsID,
          'msg_type': 'c_notice_id_Info'
        }))
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
_.each(TypeMsg, (eventType, key, list) => {
  var registerKey = 'register' + key
  var unregisterKey = 'unregister' + key

  __$p$[registerKey] = (handler, one = false) => {
    __$p$.mc.bind(eventType, handler, one)
  }
  __$p$[unregisterKey] = (handler) => {
    __$p$.mc.unbind(eventType, handler)
  }
})

var ProxyClientWebsocketForNode = SelfClass.extend(__$p$)

// -----------------------------------------------------------------------
// 统一的Client Websocket 处理, 用来与后台服务器的交互处理
//
// -----------------------------------------------
export {
  ProxyClientWebsocketForNode
}
