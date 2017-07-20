import { common } from './common'
import { communication } from './communication'
import { loaderWrapper } from './loaderWrapper'
import underscore from '../underscore'
var _ = underscore._

// 自动更新设置
/**
 * appId, 指定AppID
 * promptText, 指定提示说明
 * getDataCB. 获得数据后的处理方式
 * foundNewVersionCallback, 内置处理完成后，回调处理
 */
var uu$ = {}
uu$.hasUpdateChecked = false
uu$.checkUpdate = function (appId, promptText, getDataCB, foundNewVersionCallback) {
  try {
    var t$ = this
    var b$ = common.getBSb$()
    // var $ = common.getJQuery$()

    var _checkUpdate = function (data) {
      // 先检测是否有checkUpdate属性
      if (!data.checkUpdate) return

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

            if (_.isFunction(foundNewVersionCallback)) {
              foundNewVersionCallback(data)
            } else {
              alert(foundNewVersion)
              updateURL !== '' && b$.App.open(updateURL)
            }
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    // 尝试读取服务器配置
    if (t$.hasUpdateChecked) return

    const info = {
      machine: b$.App.getSerialNumber(),
      os: b$.App.getAppRunOnOS(),
      sandbox: b$.App.getSandboxEnable(),
      appId: b$.App.getAppId(),
      appName: b$.App.getAppName(),
      appVersion: b$.App.getAppVersion()
    }

    // 从远程服务中获取更新信息
    communication.commitMessage('/services/get_update_info', info, (_data) => {
      t$.hasUpdateChecked = true

      var data = _.isObject(_data) ? _data : {}
      data = _.isArray(data) ? { 'data': data } : data
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

// -----------------------------------------------
const update = uu$
export {
  update
}

