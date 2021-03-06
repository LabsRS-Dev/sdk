/**
 * WebHelper
 */

import { Tool } from '../include'
var uu$ = {}

uu$.RTYWebHelper = {
  ua: function () {
    return navigator.userAgent.toLowerCase()
  },
  isOpera: function () {
    var t$ = this
    var ua = t$.ua()
    return ua.indexOf('opera') > -1
  },
  isChrome: function () {
    var t$ = this
    var ua = t$.ua()
    return ua.indexOf('chrome') > -1
  },
  isSafari: function () {
    var t$ = this
    var ua = t$.ua()
    var isChrome = t$.isChrome()
    return !isChrome && (/webkit|khtml/).test(ua)
  },
  isSafari3: function () {
    var t$ = this
    var ua = t$.ua()
    var isSafari = t$.isSafari()
    return isSafari && ua.indexOf('webkit/5') !== -1
  },
  isSafariExtend: function (version) {
    var t$ = this
    var ua = t$.ua()
    var isSafari = t$.isSafari()

    /** 各版本对照关系
     * 可以通过 http://www.51.la/report/3_Client.asp?t=soft&id=2812271 获取现在机器的配置
     * AppleWebKit 602.4.6,Safari 10.0
     * AppleWebKit 602.3.12,Safari 10.0
     * AppleWebKit 602.1.50,Safari 10.0
     * AppleWebKit/601.6.17    MacOSX 10.11.5
     * AppleWebKit 601.5.17
     * AppleWebKit 601.1.46,Safari 9.0
     * AppleWebKit/600.8.9     MacSOX 10.10.5
     * AppleWebKit 600.1.4,Safari 8.0

      * AppleWebKit/537.75.14   MacSOX 10.9.3
      * AppleWebKit/537.71      MacOSX 10.9
      * AppleWebKit 537.36,Safari 4.0
      * AppleWebKit/534.57      ==================== Windows机器上测试环境, Safari Windows最高版本
      * AppleWebKit/534.55      MacSOX 10.7.3
      * AppleWebKit/534.46
      * AppleWebKit 534.34
      * AppleWebKit/537.13      MacSOX 10.6.8
      * AppleWebKit 534.30,Safari 4.0
      * AppleWebKit/534.15      MacSOX 10.6.5
      * AppleWebKit 533.1,Safari 4.0
      */
    return isSafari && ua.indexOf('webkit/' + version) !== -1 // Mac 10.10.5
  },
  isMacOS: function () {
    var nav = navigator
    try {
      var oscpu = nav['oscpu'] // for firefox developer editon version
      if (oscpu) {
        var lowCaseOSCPU = oscpu.toLowerCase()
        return lowCaseOSCPU.indexOf('mac') !== -1
      }
    } catch (e) {
      console.error(e)
    }

    return false
  },
  isWinOS: function () {
    var nav = navigator
    try {
      var oscpu = nav['oscpu'] // for firefox developer editon version
      if (oscpu) {
        var lowCaseOSCPU = oscpu.toLowerCase()
        return lowCaseOSCPU.indexOf('windows') !== -1
      }
    } catch (e) {
      console.error(e)
    }

    return false
  }
}

/**
 * 检测全局变量JQuery是否存在, 兼容以前代码
 */

function autoForJquery (ref) {
  var t$ = ref
  if (window) {
    console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!')
    console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!')
    if (window.jQuery && window.$) {
      window.$['RTYWebHelper'] = t$.RTYWebHelper

      window.$ = window.$.extend(window.$, t$)
    }
  }
}

const webHelper = uu$
autoForJquery(uu$)

export {
  webHelper
}
