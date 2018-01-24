import { common } from './common'
import { communication } from './communication'
import { compatibilityWrapper } from './compatibilityWrapper'
import { config } from './config'
import { googleLangIDMaps } from './googleLangIDMaps'
import { loadLanguage } from './loadLanguage'
import { loaderWrapper } from './loaderWrapper'
import _ from 'lodash'
import { update } from './update'
import { webHelper } from './webHelper'
import { certificateManager } from './certificateManager'
import { autoStart } from './autoStart'

/**
 * 注册内置的事件处理
 * 捕获栈信息 see http://my.oschina.net/zhangstephen/blog/673838
 * 调用栈在定位问题时超级有用。好消息是，浏览器提供了这个信息。理所当然，查看错误异常中的栈属性不是标准的一部分
 * 但是只在新的浏览器中可以使用。所以，你就可以这样来把错误日志发送给服务器了
 * 该用法用来捕捉不在try... catch 内的Error
 */
try {
  const _errorHandler = {
    errorMessage: "Dove.SDK caught the following JavaScript error.",
    globalErrorMessage: "\"{message}\" on line {line} of {file}.",
    log: function(e) {
      "undefined" != typeof window.console && "undefined" != typeof window.console.log && console.log(e)
    },
    getFormatError: function(e, t, i, l, s) {
      const splitMsg = "************************************************************************\n"
      var titleError = this.errorMessage + "\n"
      var contentError = this.globalErrorMessage.replace("{message}", e).replace("{line}", i).replace("{file}", t) + "\n"
      var stackError = ""
      if ("undefined" != typeof s && "undefined" != typeof s['stack']) {
        stackError = s.stack + "\n"
      }

      return splitMsg + titleError + contentError + stackError + splitMsg
    },
    logGlobalError: function(e, t, i, l, s) {
      this.log("************************************************************************")
      this.log(this.errorMessage)
      this.log(this.globalErrorMessage.replace("{message}", e).replace("{line}", i).replace("{file}", t))
      "undefined" != typeof s && "undefined" != typeof s.stack && (this.log(s.stack),
      this.log("************************************************************************"))
    },
    onError: function (e, t, i, l, s) {
      this.log('------异常捕获 _callReport -----')
      try {
        this.logGlobalError(e, t, i, l, s)
        const message = this.getFormatError(e, t, i, l, s) || ""

        if (config.reportErr) {
          // 发送到服务器
          communication.reportInfo({
            type: 'HTML5_RTY_EXCEPTION',
            errorMessage: message
          })
        }
      }catch(error){
        this.log(error)
      }
    }
  }

  const _watchHandler = {
    sendMsg: function(type, data) {
      try {
        // 发送到服务器
        communication.reportInfo({
          type: type || 'type',
          info: data || 'data'
        })
      }catch(e){}
    },
    onload: function () {
      this.sendMsg('SYS_INFO', 'window.onload')
    },
    onunload: function () {
      this.sendMsg('SYS_INFO', 'window.onunload')
    }
  }

  window.addEventListener('error', function (e, t, i, l, s) {
    _errorHandler.onError(e, t, i, l, s)
  })
  window.addEventListener('load', function () {
    _watchHandler.onload()
  })
  window.addEventListener('unload', function () {
    _watchHandler.onunload()
  })
} catch (error) {
  console.error(error)
}

var util = {}
util = _.extend(util, compatibilityWrapper)
util = _.extend(util, common)
util = _.extend(util, config)
util = _.extend(util, webHelper)
util = _.extend(util, communication)
util = _.extend(util, googleLangIDMaps)
util = _.extend(util, loadLanguage)
util = _.extend(util, loaderWrapper)
util = _.extend(util, update)
util = _.extend(util, certificateManager)
util = _.extend(util, autoStart)

export default {
  version: '__VERSION__',
  util: util
}
