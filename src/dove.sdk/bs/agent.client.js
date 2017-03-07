import { ProxyClientWebsocketForPython } from './proxy.client.websocket.python'
import { ProxyClientWebsocketForNode } from './proxy.client.websocket.node'
import { ProxyMessageCenter } from './proxy'
import { SelfClass } from '../observable'
import underscore from '../underscore'
var _ = underscore._

// -----------------------------------------------------------------------
const logCord = '[SDK.agent.client]'

const __key = 'agent-client'
const TypeMsg = {
  // ---------- 抽象上层为发送通知(Notice)及接收信息(Receive)
  OnReceiveFromServer: 'OnReceiveFromServer',
  OnNoticeToServer: 'OnNoticeToServer',

  // ---------- 抽象传输通道的状态变化
  OnStartBuildChannel: 'OnStartBuildChannel', // 开始建立通讯通道
  OnBuildChannelError: 'OnBuildChannelError', // 建立通讯通道发生错误
  OnFinishBuildChannel: 'OnFinishBuildChannel', // 建立通讯通道发生完成
  OnChannelFault: 'OnChannelFault' // 通讯通道意外发生故障
}

// ------------------------------------------------------------------------
// Class Chancel
let ChancelTypeIndex = 0
const ChancelType = {
  websocketForPython: ++ChancelTypeIndex,
  websocketForNode: ++ChancelTypeIndex,
  httpX: ++ChancelTypeIndex
}

class Chancel {
  build (config = {}) {
    config = _.extend({
      type: ChancelType.websocketForPython,
      ip: '127.0.0.1',
      port: '8080',
      protocol: 'ws://', // http://wwww https://wwww
      reqUrl: '/websocket',
      autoReconnectMaxRunTimes: Number.MAX_SAFE_INTEGER
    }, config)

    this.config = config
    this.type = config.type

    if (config.type === ChancelType.websocketForPython) {
      this.proxyObj = new ProxyClientWebsocketForPython()
      this.proxyObj.initWithConfig(config)
    } else if (config.type === ChancelType.websocketForNode) {
      this.proxyObj = new ProxyClientWebsocketForNode()
      this.proxyObj.initWithConfig(config)
    }
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
  getInternalMessageType: function () {
    return TypeMsg
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
  getChancelCount: () => {
    return __$p$.__chancelList.length
  },
  appendChancel: (chancel, handler) => {
    // 建立信息关联
    if (chancel.type === ChancelType.websocketForNode ||
    chancel.type === ChancelType.websocketForPython
    ) {
      console.log(chancel.server)
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
    if (chancel.type === ChancelType.websocketForNode ||
    chancel.type === ChancelType.websocketForPython
    ) {
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
    return __$p$
  },
  onReceiveFromServer: (message) => {
    __$p$.mc.trigger(TypeMsg.OnReceiveFromServer, message)
  },
  onStartBuildChannel: (message) => {
    __$p$.mc.trigger(TypeMsg.OnStartBuildChannel, message)
  },
  onBuildChannelError: (message) => {
    __$p$.mc.trigger(TypeMsg.OnBuildChannelError, message)
  },
  onFinishBuildChannel: (message) => {
    __$p$.mc.trigger(TypeMsg.OnFinishBuildChannel, message)
  },
  onChannelFault: (message) => {
    __$p$.mc.trigger(TypeMsg.OnChannelFault, message)
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

var AgentClient = SelfClass.extend(__$p$)

//
// -----------------------------------------------
export {
  AgentClient
}

