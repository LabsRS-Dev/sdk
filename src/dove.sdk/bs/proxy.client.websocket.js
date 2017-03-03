import { common } from './common'
import { Observable } from '../observable'
import underscore from '../underscore'
import { Tool } from '../include'
var _ = underscore._
var $bc_ = common

const logCord = '[SDK.Proxy.Client.Websocket]'

const __key = 'proxy-client-websocket'
const __msgPrefix = __key + _.now() + _.random(1, Number.MAX_SAFE_INTEGER)
const TypeMsg = {
  OnCreateError: __msgPrefix + 'OnCreateError',
  OnWSClose: __msgPrefix + 'OnWSClose',
  OnWSGetServerMessage: __msgPrefix + 'OnWSGetServerMessage',
  OnSendMessageToServer: __msgPrefix + 'OnSendMessageToServer'
}

// 核心消息处理中心
const __mc = new Observable()

const initializedTip = `
You must use init(config) function first, the use listen to start!!!!
`

/**
 *
 * 统一的Client Websocket 处理,
 * 用来与后台服务器的交互处理
 */
$bc_[__key] = {
  name: __key,
  getMsgHelper: () => {
    return __mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end = '') {
    if (this.debug) {
      console.log(title, message)
    }
  },
  getInternalMessageType: function () {
    return TypeMsg
  },
  internal: { // 包装到内部来处理
    bind: function (eventName, handlers, one = false) {
      __mc.bind(eventName, handlers, one)
    },
    one: function (eventNames, handlers) {
      __mc.one(eventNames, handlers)
    },
    first: function (eventName, handlers) {
      __mc.first(eventName, handlers)
    },
    trigger: function (eventName, e) {
      __mc.trigger(eventName, e)
    },
    unbind: function (eventName, handler) {
      __mc.unbind(eventName, handler)
    }
  },
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
  init: function (inConfig = {}) {
    this.log(logCord, __key + ' call init function ....')
    this.config = _.extend(this.config, inConfig)
    this.initialized = true
  },
  run: function () {
    if (!this.initialized) {
      showInitializedTip()
      return
    }
    autoCreateWS(this.getUrl())
  },

  // ------------------------------------------------
  // 消息交互的核心部分
  wsHandler: null,              // websocket 对象句柄

  // --------------- 核心消息 ------------------------
  sendMessage: (message) => {   // 客户端向服务器发送消息
    if (!this.isRunning || !this.wsHandler) {
      console.warn(logCord, 'WebSocket is not running .....')
      return
    }

    this.wsHandler.send(message)
    this.internal.trigger(TypeMsg.OnSendMessageToServer, message)
  },
  onReceiveMessage: (message) => {
    this.internal.trigger(TypeMsg.OnWSGetServerMessage, message)
  },
  // ---------------- 创建失败是回话被关闭交互 ----------------
  noticeCreateError: (message) => {
    this.internal.trigger(TypeMsg.OnCreateError, message)
  },
  noticeWSClosed: (message) => {
    this.internal.trigger(TypeMsg.OnWSClose, message)
  }
}

// 创建一个助手
const __agent = $bc_[__key]

// 批量处理注册及接收方式
_.each(_.keys(TypeMsg), (eventType, key, list) => {
  __agent['register' + key] = (handler, one = false) => {
    __agent.internal.bind(eventType, handler, one)
  }
  __agent['unregister' + key] = (handler) => {
    __agent.internal.unbind(eventType, handler)
  }
})

// ------------------------------------------------------------------------------
// ---
var autoCWSTimesIndex = 0   // 自动启动计数器
var autoReconnectMaxRunTimes = 3 // 最多尝试启动运行次数
var ws = null              // 客户端Websocket对象
var wsID = ''             // 客户端ID

function showInitializedTip () {
  console.warn(logCord, initializedTip)
}

function autoCreateWS () {
  _pAutoCreateWS()
}

function _pAutoCreateWS () {
  if (!__agent.isRunning) {
    // 尝试新的链接
    if (autoCWSTimesIndex <= autoReconnectMaxRunTimes) {
      __agent.log(logCord, 'try create new socket connect, port = ' + __agent.port)
      createWS(__agent.getUrl())
    }
    ++autoCWSTimesIndex
  }
}

// 建立Websocket 客户端
function createWS (url) {
  var WebSocket = window.WebSocket || window.MozWebSocket
  __agent.log(logCord, 'create new socket connect, wsurl = ' + url)

  try {
    ws = new WebSocket(url) // 启动监听服务
    if (ws) {
      // ==== onopen
      ws.onopen = function (evt) {
        var that = this
        __agent.wsHandler = this

        wsID = 'ws' + _.now() + _.random(1, 999999)

        if (that.readyState === 1) {
          __agent.log(logCord, 'is connecting ...')
          __agent.isRunning = true
          __agent.sendMessage(JSON.stringify({
            'user_id': wsID,
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
            autoCreateWS()
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

//
// -----------------------------------------------
const proxyClientWebsocket = $bc_
export {
  proxyClientWebsocket
}
