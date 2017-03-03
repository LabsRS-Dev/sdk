import { proxyClientWebsocket } from './proxy.client.websocket'
import { Observable } from '../observable'
import underscore from '../underscore'
import { Tool } from '../include'
var _ = underscore._
var $bc_ = proxyClientWebsocket

const logCord = '[SDK.agent.client]'

const __key = 'agent-client'
const __msgPrefix = __key + _.now() + _.random(1, Number.MAX_SAFE_INTEGER)
const TypeMsg = {
  // ---------- 抽象上层为发送通知(Notice)及接收信息(Receive)
  OnReceiveFromServer: __msgPrefix + 'OnReceiveFromServer',
  OnNoticeToServer: __msgPrefix + 'OnNoticeToServer',

  // ---------- 抽象传输通道的状态变化
  OnStartBuildChannel: __msgPrefix + 'OnStartBuildChannel', // 开始建立通讯通道
  OnBuildChannelError: __msgPrefix + 'OnBuildChannelError', // 建立通讯通道发生错误
  OnFinishBuildChannel: __msgPrefix + 'OnFinishBuildChannel', // 建立通讯通道发生完成
  OnChannelFault: __msgPrefix + 'OnChannelFault' // 通讯通道意外发生故障
}

// 核心消息处理中心
const __mc = new Observable()


const ChancelType = {
  websocket: 0,
  httpX: 1
}

class Chancel {
  build (config = {}) {
    config = _.extend({
      type: ChancelType.websocket,
      ip: '127.0.0.1',
      port: '8080',
      protocol: 'ws://', // http://wwww https://wwww
      reqUrl: '/websocket',
      autoReconnectMaxRunTimes: Number.MAX_SAFE_INTEGER
    }, config)

    if (config.type === ChancelType.websocket) {
      this.config = config
      this.type = ChancelType.websocket
      this.proxyObj = $bc_['proxy-client-websocket']
      this.proxyObj.init(config)
    }
  }

  get type () {
    return this.type
  }

  get config () {
    return this.config
  }

  get server () {
    return this.proxyObj
  }

  active () {
    this.proxyObj.run()
  }
}


/**
 *
 * 统一的Client 客户端与底层的交互处理, (底层包括：websocket服务器, httpX 服务器， 其他类型的服务)
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
  // --------------- 信息交互 ------------------------
  ChancelType: ChancelType,
  Chancel: Chancel,
  __chancelList: [],  // 通讯通道对象

  appendChancel: (chancel, handler) => {
    // 建立信息关联
    if (chancel.type === ChancelType.websocket) {
      chancel.server.registerOnWSGetServerMessage(this.onReceiveFromServer)
      chancel.server.registerOnSendMessageToServer((message) => {})

      chancel.server.registerOnCreateError(this.onBuildChannelError)
      chancel.server.registerOnWSClose(this.onChannelFault)

      chancel.active()
    }

    this.__chancelList.push(chancel)
  },
  removeChancel: (chancel) => {
    if (chancel.type === ChancelType.websocket) {
      chancel.server.unregisterOnWSGetServerMessage(this.onReceiveFromServer)
      chancel.server.unregisterOnSendMessageToServer((message) => {})

      chancel.server.unregisterOnCreateError(this.onBuildChannelError)
      chancel.server.unregisterOnWSClose(this.onChannelFault)
    }
  },
  // -------------------------------------------------
  noticeToServer: (message) => {
    _.each(this.__chancelList, (chancel) => {
      chancel.server.sendMessage(message)
    })
    this.internal.trigger(TypeMsg.OnNoticeToServer, message)
  },
  onReceiveFromServer: (message) => {
    this.internal.trigger(TypeMsg.onReceiveFromServer, message)
  },
  onStartBuildChannel: (message) => {
    this.internal.trigger(TypeMsg.OnStartBuildChannel, message)
  },
  onBuildChannelError: (message) => {
    this.internal.trigger(TypeMsg.onBuildChannelError, message)
  },
  onFinishBuildChannel: (message) => {
    this.internal.trigger(TypeMsg.onFinishBuildChannel, message)
  },
  onChannelFault: (message) => {
    this.internal.trigger(TypeMsg.onChannelFault, message)
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


//
// -----------------------------------------------
const agentClient = $bc_
export {
  agentClient
}



