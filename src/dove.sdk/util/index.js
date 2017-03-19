import { common } from './common'
import { communication } from './communication'
import { compatibilityWrapper } from './compatibilityWrapper'
import { config } from './config'
import { googleLangIDMaps } from './googleLangIDMaps'
import { loadLanguage } from './loadLanguage'
import { loaderWrapper } from './loaderWrapper'
import underscore from '../underscore'
import { update } from './update'
import { webHelper } from './webHelper'

var _ = underscore._

/**
 * 注册内置的事件处理
 * 捕获栈信息 see http://my.oschina.net/zhangstephen/blog/673838
 * 调用栈在定位问题时超级有用。好消息是，浏览器提供了这个信息。理所当然，查看错误异常中的栈属性不是标准的一部分
 * 但是只在新的浏览器中可以使用。所以，你就可以这样来把错误日志发送给服务器了
 * 该用法用来捕捉不在try... catch 内的Error
 */
try {
  var _callReport = function (e) {
    try {
      var message = common.RTYUtils.getErrorMessage(e)
      if (message && message !== '') {
        console.log('------异常捕获 _callReport -----')
        console.log(message)

        if (config.reportErr) {
          // 发送到服务器
          communication.reportInfo({
            type: 'HTML5_RTY_EXCEPTION',
            errorMessage: message
          })
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  window.addEventListener('error', function (e) {
    _callReport(e)
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

export default {
  version: '__VERSION__',
  util: util
}
