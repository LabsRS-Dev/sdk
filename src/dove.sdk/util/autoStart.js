import { common } from './common'
import { update } from './update'
import { certificateManager } from './certificateManager'

var $ = common.getJQuery$()
var b$ = common.getBSb$()

// 证书授权初始化
function certificateManagerInit () {
  var cerMgr = certificateManager.CertificateManagerOnline

  if (b$.App.getSandboxEnable()) return

  // 自动启动授权管理注册机器
  cerMgr.registerMachine()

  // 自动检测当前是否已经注册，已经注册的话,
  if (b$.App.getIsRegistered()) {
    const regInfo = JSON.parse(b$.App.getRegInfoExJSONString())
    if (regInfo.certificate) {
      cerMgr.bindCertificate(regInfo.certificate, () => {
        console.log('------------- bindCertificate .... -------')
      })
    }
  }
}

// 更新检测初始化
function updateCheckInit () {
  setTimeout(function () {
    update.checkStartInfo()

    if (b$.App.getSandboxEnable() && b$.App.getAppRunOnOS() === 'MacOSX') {
      console.log('------------- common app starting .... -------')
    } else {
      update.checkUpdate()
          // uu$.checkPatches()
    }
  }, 35 * 1000) // 35sec
}

// 内核加入自启动部分代码
try {
  if ($) {
    $(document).ready(function () {
      console.log(
        '-------------Delayed loading method, do not reflect here-------')

      // 授权证书管理初始化
      certificateManagerInit()

      // 默认添加提示新版本
      updateCheckInit()
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
