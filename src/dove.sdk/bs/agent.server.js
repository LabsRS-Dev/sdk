import { ProxyServer } from './proxy.server'
import { ProxyMessageCenter } from './proxy'
import { SelfClass } from '../observable'
import underscore from '../underscore'
var _ = underscore._

// -----------------------------------------------------------------------
const logCord = '[SDK.agent.server]'

const __key = 'agent-server'
const TypeMsg = {
  OnCallActive: 'OnCallActive'
}

// ------------------------------------------------------------------------
// Class AgentServer
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
    return __$p$
  },
  // --------------------------------------------------------
  active: (config) => {
    console.log(logCord, 'You maybe known some config information')
    var svr = new ProxyServer()
    svr.start(config)
    __$p$.mc.trigger(TypeMsg.OnCallActive, '')
    return __$p$
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

var AgentServer = SelfClass.extend(__$p$)

//
// -----------------------------------------------
export {
  AgentServer
}
