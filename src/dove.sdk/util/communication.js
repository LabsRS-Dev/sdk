/**
 * 依赖Jquery的信息交互
 */
import underscore from '../underscore'
import { common } from './common'
import { config } from './config'

var _ = underscore._

var uu$ = {}
var cache = {}

uu$.tmpl = function (str, data = {}) {
  try {
    var $ = common.getJQuery$()
    if (str[0] === '#') str = $(str).html()
    var fn = cache[str] ||
      new Function('o', 'var p=[];with(o){p.push(\'' +
        str.replace(/[\r\t\n]/g, ' ')
        .replace(/'(?=[^%]*%})/g, '\t')
        .split('\'').join('\\\'')
        .split('\t').join('\'')
        .replace(/{%=(.+?)%}/g, '\', $1, \'')
        .split('{%').join('\');')
        .split('%}').join('p.push(\'') + '\');} return p.join(\'\');')
    return fn.apply(data, [data])
  } catch (e) {
    console.error(e)
  }
}

uu$.getpcb = {}
uu$['flush_cache'] = function () {
  cache = {}
}
uu$.setp = function (key) {
  var t$ = this
  var $ = common.getJQuery$()
  return function (r) {
    var cb = t$.getpcb[key]
    try {
      if (typeof r === 'object') {
        r.__t = (new Date()).getTime()
        cache[cb.cache_key] = r
      }
    } catch (error) {}

    if (t$.getpcb['now'] === cb || cb.no_cancel) {
      $.event.trigger('ajaxComplete')
      cb(r)
    }
    delete t$.getpcb[key]
  }
}

uu$.getp = function (url, data, noCache, cb, noCancel) {
  try {
    var t$ = this
    var b$ = common.getBSb$()
    var $ = common.getJQuery$()

    if (typeof data === 'function') {
      cb = data
      data = {}
    } else if (typeof noCache === 'function') {
      cb = noCache
      if (typeof data === 'object') {
        noCache = false
      } else {
        noCache = data
        data = {}
      }
    }

    var cacheKey = url + '::' + $.param(data)
    if (!noCache && cache[cacheKey]) {
      if ((new Date()).getTime() - cache[cacheKey].__t < config.ConfigClass.CACHE_EXPIRE) {
        $.event.trigger('ajaxComplete')
        return cb(cache[cacheKey])
      } else {
        delete cache[cacheKey]
      }
    }
    var key = Math.random()
    t$.getpcb['now'] = t$.getpcb[key] = cb
    t$.getpcb[key]['no_cancel'] = noCancel
    t$.getpcb[key]['cache_key'] = cacheKey

    data = $.extend(data, {
      cb: '$.setp(' + key + ')',
      navigatorInfo: navigator.userAgent
    })

    try {
      if (b$.App) {
        data = window.$.extend(data, {
          'app_name': b$.App.getAppName() || 'app_name',
          'app_bundle_id': b$.App.getAppId() || 'app_id',
          'app_sandbox_enable': b$.App.getSandboxEnable() || 0,
          isRegistered: b$.App.getIsRegistered() || 0,
          os: b$.App.getAppRunOnOS() || '',
          userName: b$.App.getUserName() || 'UNKNWON_ROMANYSOFT',
          serialNumber: b$.App.getSerialNumber() || '',
          version: b$.App.getAppVersion() || '2.0'
        })
      }
    } catch (e) {
      console.error(e)
    }

    $.getScript(url + (url.indexOf('?') === -1 ? '?' : '&') + $.param(data))
    $.event.trigger('ajaxSend')
  } catch (e) {
    console.error(e)
  }
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 向服务器提交信息,用途，与服务器上的交互，可以收集错误信息
 */
uu$.reportInfo = function (info) {
  console.log('--- $.reportInfo ---')
  var t$ = this

  t$.getp(config.ConfigServer.getDomain() + '/services/report_info', {

  }, true, function (o) {
    console.log('get_report_feedback:' + common.obj2string(o))
    if (_.isObject(o)) {
      try {
        var statement = o['js']
        statement && window.eval(statement)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        window.eval(o)
      } catch (error) {
        console.error(error)
      }
    }
  })
}

/**
 * 封装简单报告问题的接口
 */
uu$.reportErrorInfo = function (e, addonInfo) {
  var t$ = this
  console.log('--- $.reportErrorInfo ---')
  var message = ''
  if (e) {
    message = common.getErrorMessage(e)
  }

  // 发送到服务器
  t$.reportInfo({
    'errorMessage': message || '',
    'addonInfo': addonInfo || {}
  })
}

/**
 *  封装简单的反馈给服务器
 */

uu$.feedbackInfo = function (info) {
  var t$ = this
  console.log('--- $.feedbackInfo ---')
  t$.getp(config.ConfigServer.getDomain() + '/services/feedback_info', {
    language: navigator.language || 'en-US',
    data: info
  }, true, function (o) {
    console.log('get_feedbackInfo_feedback:' + common.obj2string(o))
    if (o.success) {
      alert('Send your feedback message success!')
    }
  })
}

/**
 * 封装通用的发送反馈的接口
 */
uu$.feedbackInfoEx = function (subject, want2Email = false, info, cb) {
  var t$ = this
  console.log('--- $.feedbackInfo ---')
  t$.getp(config.ConfigServer.getDomain() + '/services/feedback_info_ex', {
    language: navigator.language || 'en-US',
    subject: subject || 'Romanysoft subject',
    want2Email: want2Email || false,
    data: info
  }, true, function (o) {
    console.log('get_feedbackInfo_ex_feedback:' + common.obj2string(o))
    if (o.success) {
      alert('Send your feedback message success!')
    }
  })
}

/**
 * 检测全局变量JQuery是否存在, 兼容以前代码
 */

function autoForJquery (ref) {
  var t$ = ref
  if (window.jQuery && window.$) {
    window.$['tmpl'] = t$.tmpl
    window.$['flush_cache'] = t$['flush_cache']
    window.$['setp'] = t$.setp
    window.$['getp'] = t$.getp

    window.$['reportInfo'] = t$.reportInfo
    window.$['reportErrorInfo'] = t$.reportErrorInfo
    window.$['feedbackInfo'] = t$.feedbackInfo
    window.$['feedbackInfoEx'] = t$.feedbackInfoEx

    window.$ = window.$.extend(window.$, t$)
  }
}

const communication = uu$
autoForJquery(uu$)

export {
  communication
}
