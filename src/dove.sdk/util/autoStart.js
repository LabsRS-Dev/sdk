import { Tool } from '../include'
import { common } from './common'
import { update } from './update'
import { certificateManager } from './certificateManager'

var $ = common.getJQuery$()
var b$ = common.getBSb$()

var uu$ = {}
// 证书授权初始化
uu$.certificateManagerInit = function () {
  var cerMgr = certificateManager.CertificateManagerOnline

  // 自动启动授权管理注册机器
  console.log('------------- registerMachine -------------')
  cerMgr.registerMachine()

  if (b$.App.getSandboxEnable()) return

  // 自动检测当前是否已经注册，已经注册的话,
  if (b$.App.getIsRegistered()) {
    try {
      const regJSONString = b$.App.getRegInfoExJSONString()
      if (!regJSONString) console.error('-------------[Error] sdk kernal can not get the reginfo -------------')

      const regInfo = JSON.parse(regJSONString)
      if (regInfo.certificate) {
        cerMgr.bindCertificate(regInfo.certificate, () => {
          console.log('------------- bindCertificate .... -------')
        })
      }
    } catch (e) {
      console.error(e)
    }
  }
}

// 更新检测初始化
uu$.updateCheckInit = function () {
  setTimeout(function () {
    const startInfo = {}
    if (!b$.App.getSandboxEnable()
      && !b$.App.getIsRegistered()
      && !b$.App.getIsSubscriptionProduct()) {
        startInfo.HasNotExpired = b$.App.getTrialHasNotExpired()
    }

    update.checkStartInfo(startInfo)

    if (b$.App.getSandboxEnable() && b$.App.getAppRunOnOS() === 'MacOSX') {
      console.log('------------- common app starting .... -------')
    } else {
      update.checkUpdate()
      // uu$.checkPatches()
    }
  }, 36 * 1000) // 36sec
}

// 内核加入自启动部分代码
try {
  if ($) {
    console.assert(Tool.isBrowser(), 'Please check current window object is a browser root Window instance !!')
    console.assert(Tool.isWindow(window), 'Please check the current code, window variables are overwritten !!')

    $(document).ready(function () {
      console.log(
        '-------------Delayed loading method, do not reflect here-------')

      // 授权证书管理初始化
      uu$.certificateManagerInit()

      // 默认添加提示新版本
      uu$.updateCheckInit()
    })
  }
} catch (e) {
  console.error(e)
}

// -----------------------------------------------
const autoStart = uu$
export {
  autoStart
}
