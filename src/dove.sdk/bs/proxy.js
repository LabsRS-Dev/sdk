import { Observable, SelfClass } from '../observable'

import _ from 'lodash'

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
  trigger: function (eventName, e) {
    // 检测e的对象类型
    if (_.isString(e)) {
      try {
        e = JSON.parse(e)
      } catch (err) {
        this.log('found err:', err)
        e = {
          data: e
        }
      }
    }
    this.__mc.trigger(eventName, e)
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
