import { common } from './common'
import { communication } from './communication'
import { loaderWrapper } from './loaderWrapper'
import { Tool } from '../include'
import _ from 'lodash'

// 自动更新设置
/**
 * appId, 指定AppID
 * promptText, 指定提示说明
 * getDataCB. 获得数据后的处理方式
 * foundNewVersionCallback, 内置处理完成后，回调处理
 */
var uu$ = {}

// 检测在线补丁包
uu$.checkPatches = function (data) {
  console.log('#[get core_patch info data] .......')
  const _key = 'checkPatchs'

  if (!_.has(data, _key)) return

  const enable = _.get(data, _key + '.enable', false)
  const url = _.get(data, _key + '.url', null)

  if (enable && _.isString(url) && !Tool.isBlank(url)) {
    loaderWrapper.RTY_3rd_Ensure.ensure({
      js: url
    }, function () {})
  }
}

// 检测促销包
uu$.checkPromotions = function (data) {
  console.log('#[get core_promo info data] .......')

  const _key = 'checkPromotions'

  if (!_.has(data, _key)) return

  const enable = _.get(data, _key + '.enable', false)
  const url = _.get(data, _key + '.url', null)

  if (enable && _.isString(url) && !Tool.isBlank(url)) {
    loaderWrapper.RTY_3rd_Ensure.ensure({
      js: url
    }, function () {})
  }
}

uu$.hasUpdateChecked = false
uu$.checkUpdate = function (appId, promptText, getDataCB, foundNewVersionCallback) {
  try {
    var t$ = this
    var b$ = common.getBSb$()
    // var $ = common.getJQuery$()

    var _checkUpdate = function (data) {
      // 先检测是否有checkUpdate属性
      if (!_.has(data, 'checkUpdate')) return

      try {
        var lastVersion = _.get(data.checkUpdate, 'lastVersion', '0.0.0')
        var lastBuildVersion = _.get(data.checkUpdate, 'lastBuildVersion', '0.0.0')
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
          // 比较发行版本
          var curAppVersion = b$.App.getAppVersion()
          console.log('Version: last:' + lastVersion + ',cur:' + curAppVersion)
          if (common.compareVersion(lastVersion, curAppVersion) === 1) {
            const foundNewVersion = promptText || data.checkUpdate.prompt ||
              'The new version has been released.'

            if (_.isFunction(foundNewVersionCallback)) {
              foundNewVersionCallback(data)
            } else {
              alert(foundNewVersion)
              updateURL !== '' && b$.App.open(updateURL)
            }
          }

          // 比较构建版本
          var curBuildVersion = b$.App.getAppBuildVersion()
          console.log('BuildVersion: last:' + lastBuildVersion + ',cur:' + curBuildVersion)
          if (common.compareVersion(lastBuildVersion, curBuildVersion) === 1) {
            const foundNewVersion = promptText || data.checkUpdate.prompt ||
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
    console.log('#[get update info] .......')
    communication.commitMessage('/services/get_update_info', info, (_data) => {
      t$.hasUpdateChecked = true

      var serverData = _.isObject(_data) ? _data : {}
      serverData = _.isArray(serverData) ? { 'data': serverData } : serverData
      getDataCB && getDataCB(serverData)

      console.log('#[get update info data] .......')
      console.dir(serverData)

      if (!_.has(serverData, 'data')) return

      const dataInfo = serverData['data']

      // 检查更新
      _checkUpdate(dataInfo)

      // 检测补丁
      t$.checkPatches(dataInfo)

      // 检测促销包
      t$.checkPromotions(dataInfo)
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

// -----------------------------------------------
const update = uu$
export {
  update
}
