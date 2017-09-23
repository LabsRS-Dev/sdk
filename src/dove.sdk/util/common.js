/** Copyright 2012 Mozilla Foundation
 * RTYUtils
 *
 */

import BS from '../bs/index'
import { Tool } from '../include'
import _ from 'lodash'

// Object functions
// -------------------------------------------------------------------------
const logCord = '[SDK.Util.common]'
var uu$ = {}
uu$.RTYUtils = {
  find: Tool.find,
  deepCopy: Tool.deepCopy,
  forEachValue: Tool.forEachValue,
  assert: Tool.assert,
  getType: Tool.getType,
  isUndefinedOrNull: Tool.isUndefinedOrNull,
  isUndefinedOrNullOrFalse: Tool.isUndefinedOrNullOrFalse,
  isObject: Tool.isObject,
  isError: Tool.isError,
  isNaN: Tool.isNaN,
  isFinite: Tool.isFinite,
  isArguments: Tool.isArguments,
  isElement: Tool.isElement,
  isEmpty: Tool.isEmpty,
  isMatch: Tool.isMatch,
  isEqual: Tool.isEqual,
  isPromise: Tool.isPromise,
  isArray: Tool.isArray,
  isBoolean: Tool.isBoolean,
  isString: Tool.isString,
  isNull: Tool.isNull,
  isUndefined: Tool.isUndefined,
  isNumber: Tool.isNumber,
  isDate: Tool.isDate,
  isRegExp: Tool.isRegExp,
  isFunction: Tool.isFunction,
  isBlob: Tool.isBlob,
  blobData2String: Tool.blobData2String,
  blobData2ArrayBuffer: Tool.blobData2ArrayBuffer,
  param2Array: Tool.param2Array,
  arguments2Array: Tool.arguments2Array,
  getErrorMessage: Tool.getErrorMessage,
  queue: Tool.queue,
  checkFileType: Tool.checkFileType
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 对象克隆
 */
uu$.objClone = Tool.objClone
uu$.getFormatDateStr = Tool.getFormatDateStr
uu$.obj2string = Tool.obj2string
uu$.stringFormat = Tool.stringFormat
uu$.compareVersion = Tool.compareVersion
uu$.testObjectType = Tool.testObjectType

/**
 * 获取KendoUI 规定的时间
 */
uu$.getMyDateStr = function (format = 'yyyy/MM/dd hh:mm:ss') {
  this.assert(this.isUndefinedOrNullOrFalse(window.kendo), 'getMyDateStr function require kendoUI library')
  if (window.kendo) {
    return window.kendo.toString((new Date()), format)
  }
  return ''
}

uu$.getBSb$ = function () {
  if (uu$.RTYUtils.isUndefinedOrNullOrFalse(BS.b$)) {
    console.warn(logCord, 'cannot found b$')
    return null
  }

  return BS.b$
}

/**
 * 获取Jquery的接口
 */
uu$.getJQuery$ = function () {
  var $ = window.jQuery || window.$ || undefined
  console.assert(_.isObject($), 'Must be loaded jQuery library first \n')
  return $
}

/**
 * 获取SnapSVG的接口
 * @see https://www.npmjs.com/package/snapsvg
 * @see http://snapsvg.io
 */
uu$.getSnapSVG$ = function () {
  if (window) {
    var ref = window.Snap || undefined
    return ref
  }
  return undefined
}

/**
 * 获取Axio的接口
 * @see https://github.com/mzabriskie/axios
 * @see https://www.chenshaowen.com/blog/the-axios-ajax/
 */
uu$.getAxios$ = function () {
  if (window) {
    var ref = window.axios || undefined
    return ref
  }
  return undefined
}

uu$.RSTestUnit = {}

/**
 * 检测全局变量JQuery是否存在, 兼容以前代码
 */

function autoForJquery (ref) {
  var t$ = ref

  try {
    if (window) {
      if (window.jQuery && window.$) {
        window.$['objClone'] = t$.objClone
        window.$['getMyDateStr'] = t$.getMyDateStr
        window.$['getFormatDateStr'] = t$.getFormatDateStr
        window.$['obj2string'] = t$.obj2string
        window.$['stringFormat'] = t$.stringFormat
        window.$['compareVersion'] = t$.compareVersion
        window.$['testObjectType'] = t$.testObjectType
        window.$['RSTestUnit'] = t$.RSTestUnit

        window.$ = window.$.extend(window.$, t$)
      }
    }
  } catch (error) {
    // console.warn(error)
  }
}

const common = uu$
autoForJquery(uu$)

export {
  common
}
