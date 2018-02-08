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
    _splitMsg: '************************************************************************\n',
    errorMessage: "Dove.SDK caught the following JavaScript error.",
    globalErrorMessage: "\"{message}\" on line {line} of {file}.",
    log: function(e) {
      ("undefined" !== typeof window.console) && ("undefined" !== typeof window.console.log) && window.console.log(e)
    },
    getFormatError: function(message, source, lineno, colno, error) {
      const splitMsg = this._splitMsg
      var titleError = this.errorMessage + "\n"
      var contentError = this.globalErrorMessage.replace("{message}", message).replace("{line}", lineno).replace("{file}", source) + "\n"
      var stackError = ""
      if ("undefined" != typeof error && "undefined" != typeof error['stack']) {
        stackError = error.stack + "\n"
      }

      return splitMsg + titleError + contentError + stackError + splitMsg
    },
    logGlobalError: function(message, source, lineno, colno, error) {
      this.log(this._splitMsg)
      this.log(this.errorMessage)
      this.log(this.globalErrorMessage.replace("{message}", message).replace("{line}", lineno).replace("{file}", source))
      "undefined" != typeof error && "undefined" != typeof error.stack && (this.log(error.stack))
      this.log(this._splitMsg)
    },
    onError: function (message, source, lineno, colno, error) {
      this.log('------异常捕获 _callReport -----')
      try {
        this.logGlobalError(message, source, lineno, colno, error)
        const _message = this.getFormatError(message, source, lineno, colno, error) || ""

        if (config.reportErr) {
          // 发送到服务器
          communication.reportInfo({
            type: 'HTML5_RTY_EXCEPTION',
            errorMessage: _message
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

  // bind window error
  if (window.addEventListener) {
    window.addEventListener('error', function(event){
      console.log('$window.addEventListener')
      if (event) {
        const message = event['message'] || 'message'
        const source = event['filename'] || 'filename'
        const lineno = event['lineno'] || 1
        const colno = event['colno'] || 1
        const error = event['error'] || new ErrorEvent()
  
        _errorHandler && _errorHandler.onError(message, source, lineno, colno, error)
      }
    }, true)
    window.addEventListener('load', function () {
      _watchHandler.onload()
    }, true)
    window.addEventListener('unload', function () {
      _watchHandler.onunload()
    }, true)
  } else {
    const oldOnerrorFunc = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
      console.log('$window.onerror$')
      _errorHandler && _errorHandler.onError(message, source, lineno, colno, error)
      /**
       *  而浏览器是否按照其默认方式显示错误消息，取决于 onerror 事件的返回值。
       *  若返回 false，则在浏览器控制台（若有）中显示错误消息。反之则不再显示错误消息。
       */
      return false
    }
  }

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
