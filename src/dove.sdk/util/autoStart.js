import { common } from './common'
import { update } from './update'
import { certificateManager } from './certificateManager'

// 内核加入自启动部分代码
try {
  var $ = common.getJQuery$()
  var b$ = common.getBSb$()
  var cerMgr = certificateManager.CertificateManagerOnline
  if ($) {
    $(document).ready(function () {
      console.log(
        '-------------Delayed loading method, do not reflect here-------')

      // 启动授权管理注册机器
      cerMgr.registerMachine()

      // / 默认添加提示新版本
      setTimeout(function () {
        update.checkStartInfo()

        if (b$.App.getSandboxEnable() && b$.App.getAppRunOnOS() === 'MacOSX') {
          console.log('------------- common app starting .... -------')
        } else {
          update.checkUpdate()
          // uu$.checkPatches()
        }
      }, 35 * 1000) // 35sec
    })
  }
} catch (e) {
  console.error(e)
}

var uu$ = {}
// -----------------------------------------------
const autoStart = uu$
export {
  autoStart
}
