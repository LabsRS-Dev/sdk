/**
 * Config
 */

var uu$ = {}

uu$.enableAppConfigDebug = uu$['enable_AppConfig_debug'] = false // 是否开启调试AppConfig

uu$.ConfigServer = {
  getDomain: function (useDebug = uu$.enableAppConfigDebug) {
    // var isHttps = (document.location.protocol === 'https:')
    var prex = 'https://' // 升级以后的，都需要https:// 安全请求
    return useDebug ? (prex + '127.0.0.1:3000') : (prex + 'www.romanysoft.com')
  },
  getMessageServer: function (useDebug = uu$.enableAppConfigDebug) {
    return useDebug ? 'ws://127.0.0.1:3000' : 'ws://www.romanysoft.com:8000'
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
