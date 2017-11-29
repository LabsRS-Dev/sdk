import _ from 'lodash'

/**
 * 纯算法，不依赖bs模块及util模块
 */
var Tool = {
  /**
   * Get the first item that pass the test
   * by second argument function
   *
   * @param {Array} list
   * @param {Function} f
   * @return {*}
   */
  find: function (list, f) {
    return list.filter(f)[0]
  },
  /**
   * Deep copy the given object considering circular structure.
   * This function caches all nested objects and its copies.
   * If it detects circular structure, use cached copy to avoid infinite loop.
   *
   * @param {*} obj
   * @param {Array<Object>} cache
   * @return {*}
   */
  deepCopy: function (obj, cache = []) {
    var t$ = Tool
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    // if obj is hit, it is in circular structure
    const hit = t$.find(cache, c => c.original === obj)
    if (hit) {
      return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
      original: obj,
      copy
    })

    Object.keys(obj).forEach(key => {
      copy[key] = t$.deepCopy(obj[key], cache)
    })

    return copy
  },
  forEachValue: function (obj, fn) {
    Object.keys(obj).forEach(key => fn(obj[key], key))
  },
  assert: function (condition, msg) {
    if (!condition) throw new Error(`[sdk] ${msg}`)
  },
  getType: function (o) {
    return Object.prototype.toString.call(o)
  },
  isUndefinedOrNull: function (o) {
    return _.isUndefined(o) || _.isNull(o)
  },
  isUndefinedOrNullOrFalse: function (o) {
    var t$ = Tool
    return t$.isUndefinedOrNull(o) || o === false
  },
  isObject: _.isObject,
  isError: _.isError,
  isNaN: _.isNaN,
  isFinite: _.isFinite,
  isArguments: _.isArguments,
  isElement: _.isElement,
  isEmpty: _.isEmpty,
  isMatch: _.isMatch,
  isEqual: _.isEqual,
  isPromise: function (val) {
    return val && typeof val.then === 'function'
  },
  isArray: _.isArray,
  isBoolean: _.isBoolean,
  isString: _.isString,
  isNull: _.isNull,
  isUndefined: _.isUndefined,
  isNumber: _.isNumber,
  isDate: _.isDate,
  isRegExp: _.isRegExp,
  isFunction: _.isFunction,
  isBlob: function (o) {
    return Object.prototype.toString.call(o) === '[object Blob]'
  },
  isBrowser: function () {
    var t$ = Tool
    var isBrowser = t$.isWindow(window)
    return isBrowser
  },
  isNodeJs: function () {
    var t$ = Tool
    return !(t$.isBrowser())
  },
  isWindow: function (arg) {
    // Safari returns DOMWindow
    // Chrome returns global
    // Firefox, Opera & IE9 return Window
    var objStr = Object.prototype.toString.call(arg || this)
    switch (objStr) {
      case '[object DOMWindow]':
      case '[object Window]':
      case '[object global]':
        return true
    }
    try {
      if (arg instanceof Window) {
        return true
      }
    } catch (e) {
      console.error(e)
    }

    // /window objects always have a `self` property;
    // /however, `arg.self == arg` could be fooled by:
    // /var o = {};
    // /o.self = o;
    if ('self' in arg) {
      // `'self' in arg` is true if
      // the property exists on the object _or_ the prototype
      // `arg.hasOwnProperty('self')` is true only if
      // the property exists on the object
      var hasSelf = arg.hasOwnProperty('self')
      var self
      try {
        if (hasSelf) {
          self = arg.self
        }
        delete arg.self
        if (hasSelf) {
          arg.self = self
        }
      } catch (e) {
          // IE 7&8 throw an error when window.self is deleted
        return true
      }
    }
    return false
  },
  /**
   * Blob data convert to String
   * @param o Blob obj
   * @param cb callback function
   */
  blobData2String: function (o, cb) {
    try {
      var reader = new FileReader()
      reader.onload = function (event) {
        cb && cb(reader.result)
      }
      reader.readAsText(o)
    } catch (error) {
      throw error
    }
  },
  /**
   * Blob data convert to ArrayBuffer
   * @param o Blob obj
   * @param cb callback function
   */
  blobData2ArrayBuffer: function (o, cb) {
    try {
      var reader = new FileReader()
      reader.onload = function (event) {
        cb && cb(reader.result)
      }
      reader.readAsArrayBuffer(o)
    } catch (error) {
      throw error
    }
  },
  /**
   * param wrapper to Array
   */
  param2Array: function (param, allowTypes) {
    var t$ = Tool
    allowTypes = allowTypes || []
    if (t$.isUndefinedOrNull(param)) return []
    if (allowTypes.findIndex(function (value, index, err) {
      return value === t$.getType(param)
    }) > -1) {
      return [param]
    }
    if (t$.isArray(param)) return param
    return []
  },
  /**
   * convert arguments to a Array
   */
  arguments2Array: function () {
    return [].slice.call(arguments, 0)
  },
  /**
   * Format error string
   * @param err  error object
   * @return String
   */
  getErrorMessage: function (err) {
    let msg = ''
    var t$ = Tool
    try {
      if (t$.isString(err)) {
        msg = err
      } else if (t$.isError(err)) {
        msg = err.message
      } else if (t$.isObject(err)) {
        var errMsg = []
        for (var p in err) {
          if (err.hasOwnProperty(p)) {
            errMsg.push(p + '=' + err[p])
          }
        }
        if (errMsg.length === 0) {
          msg = err
        } else {
          msg = errMsg.join('\n')
        }
      } else {
        msg += '[RTY_CANT_TYPE] = ' + t$.getType(err)
        msg += JSON.stringify(err)
      }
    } catch (error) {
      throw error
    }

    return msg
  },
  queue: function (_done) {
    var _next = []
    var callback = function (err) {
      if (!err) {
        var next = _next.shift()
        if (next) {
          var args = arguments
          args.length ? (args[0] = callback) : (args = [callback])
          return next.apply(null, args)
        }
        return _done.apply(null, arguments)
      }
    }

    var r = {
      next: function (fn) {
        _next.push(fn)
        return r
      },
      done: function (fn) {
        _done = fn
        r.start()
      },
      start: function () {
        callback(null, callback)
      }
    }

    return r
  },
  /**
   * Check fileName's type in the fileTypes
   * @param fileName String
   * @param fileTypes Array []
   * @return Boolean {true, false}
   */
  checkFileType: function (fileName, fileTypes) {
    var _fileNameStr = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase()
    if (fileTypes.indexOf(_fileNameStr) > -1) return true
    return false
  },
  obj2string: function (o) {
    var r = []
    var t$ = Tool
    if (typeof o === 'string') {
      return '\'' + o.replace(/([\'\'\\])/g, '\\$1').replace(/(\n)/g, '\\n')
        .replace(/(\r)/g, '\\r').replace(/(\t)/g, '\\t') + '\''
    }
    if (typeof o === 'object' && o != null) {
      if (!o.sort) {
        for (var i in o) {
          r.push(i + ':' + t$.obj2string(o[i]))
        }
        if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
          r.push('toString:' + o.toString.toString())
        }
        r = '{' + r.join() + '}'
      } else {
        for (let i = 0; i < o.length; i++) {
          r.push(t$.obj2string(o[i]))
        }
        r = '[' + r.join() + ']'
      }
      return r
    }

    if (o != null) {
      return o.toString()
    }

    return ''
  },
  // 字符串参数格式化 {index}
  stringFormat: function () {
    if (arguments.length === 0) return null
    var str = arguments[0]
    for (var i = 1; i < arguments.length; i++) {
      var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm')
      str = str.replace(re, arguments[i])
    }
    return str
  },
  objClone: function (Obj) {
    var buf
    var t$ = Tool
    if (Obj instanceof Array) {
      buf = []
      var i = Obj.length
      while (i--) {
        buf[i] = t$.objClone(Obj[i])
      }
      return buf
    } else if (Obj instanceof Object) {
      buf = {}
      for (var k in Obj) {
        if (Obj.hasOwnProperty(k)) {
          buf[k] = t$.objClone(Obj[k])
        }
      }
      return buf
    } else {
      return Obj
    }
  },
  // 获取简易的格式化时间
  getFormatDateStr: function (dateObj, fmt) {
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
    // (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
    var that = dateObj
    var o = {
      'M+': that.getMonth() + 1, // 月份
      'd+': that.getDate(), // 日
      'h+': that.getHours(), // 小时
      'm+': that.getMinutes(), // 分
      's+': that.getSeconds(), // 秒
      'q+': Math.floor((that.getMonth() + 3) / 3), // 季度
      'S': that.getMilliseconds() // 毫秒
    }

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (that.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(
          ('' + o[k]).length)))
      }
    }

    return fmt
  },

  /**
   * 比较两个版本号
   * @param version1 {String} || {Number} 版本号1
   * @param version2 {String} || {Number} 版本号2
   * @return {Number} 1, 大于；0 等于；-1 小于
   */
  compareVersion: function (version1, version2) {
    try {
      if (_.isNumber(version1) && _.isNumber(version2)) {
        if (version1 > version2) return 1
        if (version1 === version2) return 0
        if (version1 < version2) return -1
      } else if (_.isNumber(version1) || _.isNumber(version2)) {
        version1 += ''
        version2 += ''
      }

      var version1Array = version1.split('.')
      var version2Array = version2.split('.')

      var ver1IntList = []
      var ver2IntList = []

      version1Array.forEach(function (value, index, array) {
        ver1IntList.push(parseInt(value))
      })

      version2Array.forEach(function (value, index, array) {
        ver2IntList.push(parseInt(value))
      })

      // format
      if (ver1IntList.length < ver2IntList.length) {
        let i = 0
        for (; i < (ver2IntList.length - ver1IntList.length); ++i) {
          ver1IntList.push(0)
        }
      }

      if (ver1IntList.length > ver2IntList.length) {
        let i = 0
        for (; i < (ver1IntList.length - ver2IntList.length); ++i) {
          ver2IntList.push(0)
        }
      }

      let i = 0
      for (; i < ver1IntList.length; ++i) {
        var cVer1 = ver1IntList[i]
        var cVer2 = ver2IntList[i]

        if (cVer1 > cVer2) return 1
        if (cVer1 < cVer2) return -1
      }

      return 0
    } catch (e) {
      return -1
    }
  },
  // 测试对象类型
  testObjectType: function (obj, type) {
    var t$ = Tool
    var actualType = t$.getType(obj)
    if (actualType !== type) {
      var errMsg = 'TestType:[' + type + '], actual:[' + actualType + '].'
      console.assert(false, errMsg)
    }
  }

}

// -------------------------------------------------------

export {
   Tool
}

