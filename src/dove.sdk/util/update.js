import { common } from './common'
import { communication } from './communication'
import { loaderWrapper } from './loaderWrapper'

// 自动更新设置
/**
 * appId, 指定AppID
 * promptText, 指定提示说明
 * getDataCB. 获得数据后的处理方式
 * cb, 内置处理完成后，回调处理
 */
var uu$ = {}
uu$.hasUpdateChecked = false
uu$.checkUpdate = function (appId, promptText, getDataCB, cb) {
  try {
    var t$ = this
    var b$ = common.getBSb$()
    var $ = common.getJQuery$()

    var _checkUpdate = function (data) {
      try {
        var lastVersion = data.checkUpdate.lastVersion || ''
        var updateURL = data.checkUpdate.updateURL || ''

        // 检查是否有队苹果Apple 应用或者不使用
        var enableForMacOSAppStore = data.checkUpdate.enableForMacOSAppStore !==
          false
        var enableForElectron = data.checkUpdate.enableForElectron !== false
        var enableForNoMacOSAppStore = true

        enableForMacOSAppStore = enableForMacOSAppStore && b$.pIsUseMacCocoEngine &&
          b$.App.getSandboxEnable()
        enableForElectron = enableForElectron && b$.pIsUseElectron
        enableForNoMacOSAppStore = b$.pIsUseMacCocoEngine && !b$.App.getSandboxEnable()

        // 任意符合两种模式都可以启用
        if (enableForMacOSAppStore || enableForElectron || enableForNoMacOSAppStore) {
          // 比较
          var curAppVersion = b$.App.getAppVersion()
          console.log('last:' + lastVersion + ',cur:' + curAppVersion)
          if (common.compareVersion(lastVersion, curAppVersion) === 1) {
            var foundNewVersion = promptText || data.checkUpdate.prompt ||
              'The new version has been released.'
            alert(foundNewVersion)
            updateURL !== '' && b$.App.open(updateURL)
            cb && cb(data)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    // 尝试读取服务器配置
    var jsonFile = appId || b$.App.getAppId() + '.json'
    var serverUrl = 'https://romanysoft.github.io/assert-config/configs/' + jsonFile
    $.getJSON(serverUrl, function (data) {
      if (t$.hasUpdateChecked) return
      t$.hasUpdateChecked = true

      data = typeof data === 'object' ? data : {}
      data = data instanceof Array ? {
        'data': data
      } : data
      getDataCB && getDataCB(data)
      _checkUpdate(data)
    })
  } catch (e) {
    console.error(e)
  }
}

// 检测及汇报状态
uu$.checkStartInfo = function (info) {
  var b$ = common.getBSb$()
  if (b$.pN) {
    communication.reportInfo({
      'SYS_state': 'Starting...',
      'Add_info': info || {}
    })
  }
}

// 检测在线补丁包
uu$.checkPatches = function (info) {
  loaderWrapper.RTY_3rd_Ensure.ensure({
    js: 'https://romanysoft.github.io/assert-config/patchs/config.js'
  }, function () {})
}

// 内核加入自启动部分代码
try {
  var $ = common.getJQuery$()
  var b$ = common.getBSb$()
  if ($) {
    $(document).ready(function () {
      console.log(
        '-------------Delayed loading method, do not reflect here-------')

      // / 默认添加提示新版本
      setTimeout(function () {
        uu$.checkStartInfo()

        if (b$.App.getSandboxEnable() && b$.App.getAppRunOnOS() === 'MacOSX') {
          console.log('------------- common app starting .... -------')
        } else {
          uu$.checkUpdate()
          // uu$.checkPatches()
        }
      }, 35 * 1000) // 35sec
    })
  }
} catch (e) {
  console.error(e)
}

// -----------------------------------------------
const update = uu$
export {
  update
}

