import { Observable, SelfClass } from '../observable'
import underscore from '../underscore'
var _ = underscore._

var __$p$ = {
  init: function () {
    __$p$.__mc = new Observable()
  },

  debugLog: false,
  log: (title, message, end = '') => {
    if (__$p$.debugLog) {
      console.log(title, message, end)
    }
  },

  bind: function (eventName, handlers, one = false) {
    __$p$.__mc.bind(eventName, handlers, one)
  },
  one: function (eventNames, handlers) {
    __$p$.__mc.one(eventNames, handlers)
  },
  first: function (eventName, handlers) {
    __$p$.__mc.first(eventName, handlers)
  },
  trigger: function (eventName, e) {
    // 检测e的对象类型
    if (_.isString(e)) {
      try {
        e = JSON.parse(e)
      } catch (err) {
        __$p$.log('found err:', err)
        e = {
          data: e
        }
      }
    }
    __$p$.__mc.trigger(eventName, e)
  },
  unbind: function (eventName, handler) {
    __$p$.__mc.unbind(eventName, handler)
  }
}

var ProxyMessageCenter = SelfClass.extend(__$p$)
//
// -----------------------------------------------
export {
  ProxyMessageCenter
}
