/**
 * Config
 */
import { Tool } from '../include'
import { common } from './common'
import _ from 'lodash'

var uu$ = {}

uu$.enableAppConfigDebug = uu$['enable_AppConfig_debug'] = false // 是否开启调试AppConfig

uu$.ConfigServer = {
  _removeServerControlUrl: function (url) {
    if (!url) return ''
    url = _.replace(url, 'http://', '')
    url = _.replace(url, 'https://', '')
    url = _.replace(url, 'ws://', '')
    return url
  },
  getDomain: function (useDebug = uu$.enableAppConfigDebug, enforceHttps = false) {
    var t$ = this
    try {
      var b$ = common.getBSb$()
      var aws = b$.App.getReleaseServer()
      var awsDebug = b$.App.getDebugServer()

      awsDebug = t$._removeServerControlUrl(awsDebug)
      aws = t$._removeServerControlUrl(aws)

      var controlPrefix = enforceHttps ? 'https://' : 'http://' // 升级以后的，都需要https:// 安全请求
      if (useDebug) {
        if (awsDebug) {
          return controlPrefix + awsDebug
        }
        return controlPrefix + '127.0.0.1:3000'
      }

      return controlPrefix + aws
    } catch (e) {
      console.error(e)
    }

    return 'http://romanysoft.com'
  },
  getMessageServer: function (useDebug = uu$.enableAppConfigDebug, wsPrefix = 'ws://') {
    var t$ = this
    try {
      var b$ = common.getBSb$()
      var aws = b$.App.getReleaseServer()
      var awsDebug = b$.App.getDebugServer()

      awsDebug = t$._removeServerControlUrl(awsDebug)
      aws = t$._removeServerControlUrl(aws)

      if (useDebug) {
        if (awsDebug) {
          return wsPrefix + awsDebug
        }
        return wsPrefix + '127.0.0.1:3000'
      }

      return wsPrefix + aws
    } catch (e) {
      console.error(e)
    }
    return 'ws://127.0.0.1:3000'
  }
}

uu$.ConfigClass = {
  domain: function () {
    return uu$.ConfigServer.getDomain()
  },
  messageServer: function () {
    return uu$.ConfigServer.getMessageServer()
  },
  CACHE_EXPIRE: 60000 * 10 // 数据缓存时间
}

uu$.kendoUIUrl = '' // 配置KendoUI的Url方便，全局处理
uu$.reportErr = false // 是否发送错误报告到服务器

uu$['RTY_Config'] = {
  'kendoui_url': uu$.kendoUIUrl,
  'reportErr': uu$.reportErr
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
      window.$['RTY_Config'] = t$['RTY_Config']

      window.$ = window.$.extend(window.$, t$)
    }
  }
}

const config = uu$
autoForJquery(uu$)

export {
  config
}
