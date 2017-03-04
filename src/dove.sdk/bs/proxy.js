import { Observable, Class } from '../observable'
import underscore from '../underscore'
var _ = underscore._

var ProxyMessageCenter = Class.extend({
  init: function () {
    this.__mc = new Observable()
  },

  debugLog: false,
  log: (title, message, end = '') => {
    if (this.debugLog) {
      console.log(title, message, end)
    }
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
  trigger: function (eventName, e) {
    this.__mc.trigger(eventName, e)
  },
  unbind: function (eventName, handler) {
    this.__mc.unbind(eventName, handler)
  }
})

//
// -----------------------------------------------
export {
  ProxyMessageCenter
}
