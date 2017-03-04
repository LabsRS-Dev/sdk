import { ProxyClientWebsocket } from './proxy.client.websocket'
import { ProxyMessageCenter } from './proxy'
import { Class } from '../observable'
import underscore from '../underscore'
var _ = underscore._

// -----------------------------------------------------------------------
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

// ------------------------------------------------------------------------
// Class Chancel
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
      this.proxyObj = new ProxyClientWebsocket()
      this.proxyObj.initWithConfig(config)
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

// ------------------------------------------------------------------------
// Class AgentClient
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
  // --------------------------------------------------------
  init: () => {
  },
  // --------------- 信息交互 通道建立 ------------------------
  ChancelType: ChancelType,
  Chancel: Chancel,
  __chancelList: [],   // 通讯通道对象

  appendChancel: (chancel, handler) => {
    // 建立信息关联
    if (chancel.type === ChancelType.websocket) {
      chancel.server.registerOnWSGetServerMessage(__$p$.onReceiveFromServer)
      chancel.server.registerOnSendMessageToServer((message) => {})

      chancel.server.registerOnCreateError(__$p$.onBuildChannelError)
      chancel.server.registerOnWSClose(__$p$.onChannelFault)
      chancel.server.registerOnWSOpen(__$p$.onFinishBuildChannel)

      chancel.active()
    }

    __$p$.__chancelList.push(chancel)
  },
  removeChancel: (chancel) => {
    if (chancel.type === ChancelType.websocket) {
      chancel.server.unregisterOnWSGetServerMessage(__$p$.onReceiveFromServer)
      chancel.server.unregisterOnSendMessageToServer((message) => {})

      chancel.server.unregisterOnCreateError(__$p$.onBuildChannelError)
      chancel.server.unregisterOnWSClose(__$p$.onChannelFault)
    }
  },
  // -------------------------------------------------
  noticeToServer: (message) => {
    if (__$p$.__chancelList.length === 0) {
      console.warn(logCord, 'You maybe add one chancel')
    }

    _.each(__$p$.__chancelList, (chancel) => {
      chancel.server.sendMessage(message)
    })
    __$p$.mc.trigger(TypeMsg.OnNoticeToServer, message)
  },
  onReceiveFromServer: (message) => {
    __$p$.mc.trigger(TypeMsg.onReceiveFromServer, message)
  },
  onStartBuildChannel: (message) => {
    __$p$.mc.trigger(TypeMsg.OnStartBuildChannel, message)
  },
  onBuildChannelError: (message) => {
    __$p$.mc.trigger(TypeMsg.onBuildChannelError, message)
  },
  onFinishBuildChannel: (message) => {
    __$p$.mc.trigger(TypeMsg.onFinishBuildChannel, message)
  },
  onChannelFault: (message) => {
    __$p$.mc.trigger(TypeMsg.onChannelFault, message)
  }
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


var AgentClient = Class.extend(__$p$)

//
// -----------------------------------------------
export {
  AgentClient
}

