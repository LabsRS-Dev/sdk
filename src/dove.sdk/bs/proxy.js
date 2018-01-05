import { Observable, SelfClass } from '../observable'

var __$p$ = {
  init: function () {
    this.__mc = new Observable()
  },
  debugLog: false,
  log: function (title, message, end = '') {
    if (this.debugLog) {
      console.log(title, message, end)
    }
  },

  getEvents: function () {
    return this.__mc.getMetaDataEvents()
  },
  bind: function (eventName, handlers, one = false) {
    this.__mc.bind(eventName, handlers, one)
  },
  one: function (eventNames, handlers) {
    this.__mc.one(eventNames, handlers)
  },
  first: function (eventName, handlers) {
    this.__mc.first(eventName, handlers)
  },
  trigger: function (eventName, anyData) {
    this.__mc.trigger(eventName, anyData)
  },
  unbind: function (eventName, handler) {
    this.__mc.unbind(eventName, handler)
  }
}

var ProxyMessageCenter = SelfClass.extend(__$p$)
//
// -----------------------------------------------
export {
  ProxyMessageCenter
}
