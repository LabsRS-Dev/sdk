import _ from 'lodash'

const logCord = '[SDK.Observable].'
// -----------------------------------------------------------------
// extend from kendo.core.js

function deepExtend (destination) {
  var i = 1,
    length = arguments.length

  for (i = 1; i < length; i++) {
    deepExtendOne(destination, arguments[i])
  }
  return destination
}

function deepExtendOne (destination, source) {
  var property,
    propValue,
    propType,
    propInit,
    destProp

  for (property in source) {
    propValue = source[property]
    propType = typeof propValue

    if (propType === 'object' && propValue !== null) {
      propInit = propValue.constructor
    } else {
      propInit = null
    }

    if (propInit &&
      propInit !== Array && propInit !== RegExp) {
      if (propValue instanceof Date) {
        destination[property] = new Date(propValue.getTime())
      } else if (_.isFunction(propValue.clone)) {
        destination[property] = _.clone(propValue)
      } else {
        destProp = destination[property]
        if (typeof (destProp) === 'object') {
          destination[property] = destProp || {}
        } else {
          destination[property] = {}
        }
        deepExtendOne(destination[property], propValue)
      }
    } else if (propType !== 'undefined') {
      destination[property] = propValue
    }
  }

  return destination
}

var preventDefault = function () {
  this.defaultPrevented = true
}

var isDefaultPrevented = function () {
  return this.defaultPrevented === true
}

function SelfClass () {}
SelfClass.extend = function (proto) {
  var base = function () {},
    member,
    that = this,
    subclass = proto && proto.init ? proto.init : function () {
      that.apply(this, arguments)
    },
    fn

  base.prototype = that.prototype
  fn = subclass.fn = subclass.prototype = new base()

  for (member in proto) {
    if (proto[member] != null && proto[member].constructor === Object) {
      // Merge object members
      // fn[member] = extend(true, {}, base.prototype[member], proto[member])
      // fn[member] = _.extend({}, base.prototype[member], proto[member])
      fn[member] = deepExtend({}, base.prototype[member], proto[member])
    } else {
      fn[member] = proto[member]

      if (_.isFunction(proto[member])) {
        fn[member].bind(subclass)
      }
    }
  }

  fn.constructor = subclass
  subclass.extend = that.extend

  return subclass
}

SelfClass.prototype._initOptions = function (options) {
  this.options = deepExtend({}, this.options, options)
}

var Observable = SelfClass.extend({
  init: function () {
    this._events = {}
    this._name = _.uniqueId(logCord),
    this._debug = false
  },

  getInternalName: function () {
    return _.get(this, '_name', '')
  },

  getEnableDebug: function () {
    return _.get(this, '_debug', false)
  },

  setEnableDebug: function (enable) {
    this._debug = enable && true
  },

  getMetaDataEvents: function () {
    return this._events
  },

  bind: function (eventName, handlers, one) {
    var that = this,
      idx,
      eventNames = _.isString(eventName) ? [eventName] : eventName,
      length,
      original,
      handler,
      handlersIsFunction = _.isFunction(handlers),
      events

    if (handlers === undefined) {
      for (idx in eventName) {
        that.bind(idx, eventName[idx])
      }
      return that
    }

    for (idx = 0, length = eventNames.length; idx < length; idx++) {
      eventName = eventNames[idx]

      handler = handlersIsFunction ? handlers : handlers[eventName]

      if (handler) {
        if (one) {
          original = handler
          handler = function () {
            that.unbind(eventName, handler)
            original.apply(that, arguments)
          }
          handler.original = original
        }
        events = that._events[eventName] = that._events[eventName] || []
        events.push(handler)
      }
    }

    return that
  },

  one: function (eventNames, handlers) {
    return this.bind(eventNames, handlers, true)
  },

  first: function (eventName, handlers) {
    var that = this,
      idx,
      eventNames = _.isString(eventName) ? [eventName] : eventName,
      length,
      handler,
      handlersIsFunction = _.isFunction(handlers),
      events

    for (idx = 0, length = eventNames.length; idx < length; idx++) {
      eventName = eventNames[idx]

      handler = handlersIsFunction ? handlers : handlers[eventName]

      if (handler) {
        events = that._events[eventName] = that._events[eventName] || []
        events.unshift(handler)
      }
    }

    return that
  },

  /**
   * 触发事件，附带数据
   * @argument eventName {String} 事件类型标识
   * @argument anyData {Any} 任何数据
   */
  trigger: function (eventName, anyData) {
    var that = this,
      events = that._events[eventName],
      idx,
      length

    if (events) {
      // Auto check by self
      var eventObj = {
          data: {}
        },
        dataIsDirectTransfer = false,
        dataIsStringToJSON = false

      if (_.isPlainObject(anyData)) {
        eventObj.data = anyData
      } else if (_.isString(anyData)) {
        try {
          const jsonData = JSON.parse(anyData)
          if (that.getEnableDebug()) {
            console.warn(logCord, '[Y] anyData is json string, parsed to Object => ', anyData)
          }
          dataIsStringToJSON = true
          eventObj.data = jsonData
        } catch(err){
          if (that.getEnableDebug()) {
            console.warn(logCord, '[X] anyData is not json string => ', anyData)
          }
          eventObj.data = anyData
          dataIsDirectTransfer = true
        }
      } else {
        eventObj.data = anyData
        dataIsDirectTransfer = true
      }

      eventObj.sender = that
      eventObj.defaultPrevented = false
      eventObj.preventDefault = preventDefault
      eventObj.isDefaultPrevented = isDefaultPrevented

      //添加extend函数
      eventObj.extends = {
        getDataIsDirectTransfer: () => { return dataIsDirectTransfer },
        getDataIsStringToJSON: () => { return dataIsStringToJSON },
        getHasDataProperty: () => { return _.has(eventObj, 'data')}
      }

      events = events.slice()
      for (idx = 0, length = events.length; idx < length; idx++) {

        /**
         * 调用注册的Handler， 附带参数
         * @param {any} data 数据 eventObj.data
         * @param {Object} eventObj 事件对象
         * @returns
         */
        events[idx].call(that, eventObj.data, eventObj)
      }

      return eventObj.defaultPrevented === true
    }

    return false
  },

  unbind: function (eventName, handler) {
    var that = this,
      events = that._events[eventName],
      idx

    if (eventName === undefined) {
      that._events = {}
    } else if (events) {
      if (handler) {
        for (idx = events.length - 1; idx >= 0; idx--) {
          if (events[idx] === handler || events[idx].original === handler) {
            events.splice(idx, 1)
          }
        }
      } else {
        that._events[eventName] = []
      }
    }

    return that
  }
})

export {
  SelfClass,
  Observable
}
