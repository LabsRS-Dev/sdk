import _ from 'lodash'

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
  this._defaultPrevented = true
}

var isDefaultPrevented = function () {
  return this._defaultPrevented === true
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
    this._name = _.uniqueId('SDK-Observable-')
  },

  getInternalName: function () {
    return this._name
  },

  getMetaDataEvents: function () {
    return this._events
  },

  bind: function (eventName, handlers, one) {
    var that = this,
      idx,
      eventNames = typeof eventName === 'string' ? [eventName] : eventName,
      length,
      original,
      handler,
      handlersIsFunction = typeof handlers === 'function',
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
      eventNames = typeof eventName === 'string' ? [eventName] : eventName,
      length,
      handler,
      handlersIsFunction = typeof handlers === 'function',
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

  trigger: function (eventName, e) {
    var that = this,
      events = that._events[eventName],
      idx,
      length

    if (events) {
      //
      // Auto check object value
      if (!_.isPlainObject(e)) {
        try {
          if (_.isString(e)) {
            e = JSON.parse(e)
          } else {
            e = {
              data: e || {}
            }
          }
        } catch (err) {
          e = {
            data: e
          }
        }
      }

      e = e || {}

      e.sender = that

      e._defaultPrevented = false

      e.preventDefault = preventDefault

      e.isDefaultPrevented = isDefaultPrevented

      events = events.slice()

      for (idx = 0, length = events.length; idx < length; idx++) {
        events[idx].call(that, e)
      }

      return e._defaultPrevented === true
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
