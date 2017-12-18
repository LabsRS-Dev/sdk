/**
 * Google Lang maps
 */
import { Tool } from '../include'
import { common } from './common'
import { googleLangIDMaps } from './googleLangIDMaps'

var uu$ = {}

uu$.loadedLanguage = {
  js: [],
  json: [],

  insert: function (info, ext) {
    var jsonStr = JSON.stringify(info)
    var list = (ext === '.js' ? this.js : this.json)
    var found = false

    list.forEach(function (value, index, array) {
      if (JSON.stringify(value) === jsonStr) {
        found = true
        return false
      }
    })

    if (!found) list.push(info)
  }
}

uu$.loadLanguage = function (languageFilesPath, fileExt, callback, referLang, trySafeMode = true) {
  var t$ = this

  // Note: Check jQuery library
  common.assert(!common.isUndefinedOrNullOrFalse(window.jQuery), 'loadLanguage function require jQuery library')
  var $ = window.jQuery || window.$ || {}

  var referLangList = common.param2Array(referLang, ['string'])

  /**
   * [gotoLoadLanguageFile 加载语言文件]
   * @param  {[array]} langsFiles             语言文件列表
   * @param  {[string]} ext                   文件扩展名,只支持两种: .josn 和 .js
   * @param  {[function]} successCallback     成功加载回调
   * @return {[type]}                         null
   */
  function gotoLoadLanguageFile (langsFiles, ext, successCallback) {
    /**
     * [_tryLoad 尝试加载]
     * @param  {[string]} file        [文件路径]
     * @param  {[string]} langKey     [关键KEY]
     * @param  {[string]} ext         [扩展名：只支持两种: .josn 和 .js]
     * @param  {[function]} fnNext     [出错下一步执行函数]
     * @param  {[function]} fnCallback [成功加载回调函数]
     * @return {[type]}             [description]
     */
    function _tryLoad (file, langKey, ext, fnNext, fnCallback) {
      try {
        $.ajax({
          url: file,
          dataType: (ext === '.js' ? 'script' : 'json'),
          success: function (data, status) {
            console.log('[x] ' + status + ' =' + file)
            var obj = {
              data: data,
              status: status,
              info: {
                file: file,
                langKey: langKey,
                langID: googleLangIDMaps.getGoogleLangID(langKey),
                ext: ext
              }
            }

            t$.loadedLanguage.insert(obj.info, ext)
            fnCallback && fnCallback(obj)
          },
          error: function (req, status, err) {
            console.log(err)
            try {
              throw new Error('[x]no found... continue.. = ' + file)
            } catch (error) {
              console.warn(error)
              fnNext && fnNext(fnCallback)
            }
          }
        })
      } catch (error) {
        console.error(error)
        fnNext && fnNext()
      }
    }

    /**
     * [gotoTry 尝试]
     * @param  {[type]}   list     [文件对象列表]
     * @param  {[type]}   ext      [扩展名]
     * @param  {Function} callback [成功回调]
     * @return {[type]}            [description]
     */
    function _gotoTry (list, ext, callback) {
      if (common.isArray(list) && list.length > 0) {
        var ele = list[0]
        _tryLoad(ele.path, ele.key, ext, function (cb) {
          var newLangFileList = list.splice(1)
          _gotoTry(newLangFileList, ext, cb)
        }, callback)
      } else {
        console.warn('[x] language list length is 0 or not a array. TYPE=' + common.getType(list))
      }
    }

    // Try start
    _gotoTry(langsFiles, ext, successCallback)
  }

  // 加载语言的入口
  var curUserLanguage = null
  var b$ = null
  if (!common.isUndefinedOrNullOrFalse(window.BS)) {
    if (!common.isUndefinedOrNullOrFalse(window.BS.b$)) {
      b$ = window.BS.b$
      if (!common.isUndefinedOrNullOrFalse(b$.App)) {
        curUserLanguage = b$.App.getUserLanguage()
      }
    }
  }

  curUserLanguage = curUserLanguage || window.navigator.language || window.navigator.browserLanguage

  var defaultLangKeys = []

  // 是否尝试安全模式
  if (trySafeMode) {
    const __safeList = [
      'en-US',
      'en-US'.toLowerCase(),
      'en_US',
      'en_US'.toLowerCase(),
      'en'
    ]

    // 检测当前语言标识是否有兼容的Google语言ID
    var langID = googleLangIDMaps.getGoogleLangID(curUserLanguage)
    if (langID) defaultLangKeys.push(langID)

    // 检测当前语言是否在SafeList中
    if (__safeList.findIndex(function (value, index, err) {
      return value === curUserLanguage.toLowerCase()
    }) > -1) {
      defaultLangKeys = defaultLangKeys.concat(__safeList)
    } else {
      // 不是英语, 需要优化来处理
      defaultLangKeys = defaultLangKeys.concat([
        curUserLanguage,
        curUserLanguage.toLowerCase()
      ])

      // 如果是："zh-CN"
      if (curUserLanguage.split('-').length >= 2) {
        defaultLangKeys = defaultLangKeys.concat([
          curUserLanguage.split('-')[0],
          curUserLanguage.split('-')[0].toLowerCase()
        ])
      }

      // 如果是："zh_CN"
      if (curUserLanguage.split('_').length >= 2) {
        defaultLangKeys = defaultLangKeys.concat([
          curUserLanguage.split('_')[0],
          curUserLanguage.split('_')[0].toLowerCase()
        ])
      }

      defaultLangKeys = defaultLangKeys.concat(__safeList)
    }

    // 将指定的处理放到最前面进行处理
    defaultLangKeys = referLangList.concat(defaultLangKeys)
    // 开始解析处理
    var tryLangFileList = []
    console.log('tryLangFileList = \n')
    defaultLangKeys.forEach(function (value, index, array) {
      tryLangFileList.push({
        key: value,
        path: languageFilesPath + value + fileExt
      })
      console.log(value)
    })

    // start load language ....
    gotoLoadLanguageFile(tryLangFileList, fileExt, callback)
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
      window.$.RTYUtils = window.$.extend(window.$.RTYUtils, t$)
      window.$ = window.$.extend(window.$, t$)
    }
  }
}

const loadLanguage = uu$
autoForJquery(uu$)

export {
  loadLanguage
}
