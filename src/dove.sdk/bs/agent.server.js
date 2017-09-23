import { ProxyMessageCenter } from './proxy'
import { ProxyServer } from './proxy.server'
import { SelfClass } from '../observable'
import _ from 'lodash'

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
  getMsgHelper: function () {
    var that = this
    return that.mc
  },
  getInternalMessageType: function () {
    return TypeMsg
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end = '') {
    var that = this
    if (that.debug) {
      console.log(title, message, end)
    }
    return that
  },
  // --------------------------------------------------------
  active: function (config) {
    var that = this
    console.log(logCord, 'You maybe known some config information')
    var svr = new ProxyServer()
    svr.start(config)
    that.mc.trigger(TypeMsg.OnCallActive, '')
    return that
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

var AgentServer = SelfClass.extend(__$p$)

//
// -----------------------------------------------
export {
  AgentServer
}
