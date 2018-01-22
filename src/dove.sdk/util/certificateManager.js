import { common } from './common'
import { communication } from './communication'

var b$ = common.getBSb$()
// 产品授权使用证书管理
var uu$ = {}
uu$.CertificateManagerOnline = {

  // 注册机器
  registerMachine: (cb = () => {}) => {
    if (!b$.App.getSerialNumber()) return

    const info = {
      machine: b$.App.getSerialNumber(),
      os: b$.App.getAppRunOnOS()
    }
    communication.commitMessage('/services/machine_register', info, cb)
  },

  // 验证授权证书是否有效
  validateCertificate: (certificate, cb = () => {}) => {
    if (!b$.App.getSerialNumber()) return

    const info = {
      machine: b$.App.getSerialNumber(),
      appId: b$.App.getAppId(),
      appName: b$.App.getAppName(),
      appVersion: b$.App.getAppVersion(),
      certificate: certificate
    }
    communication.commitMessage('/services/certificate_validate', info, cb)
  },

  // 绑定授权证书
  bindCertificate: (certificate, cb = () => {}) => {
    if (!b$.App.getSerialNumber()) return

    const info = {
      machine: b$.App.getSerialNumber(),
      appId: b$.App.getAppId(),
      appName: b$.App.getAppName(),
      appVersion: b$.App.getAppVersion(),
      certificate: certificate
    }
    communication.commitMessage('/services/machine_certificate_bind', info, cb)
  },

  // 取消绑定授权证书
  unBindCertificate: (certificate, cb = () => {}) => {
    if (!b$.App.getSerialNumber()) return

    const info = {
      machine: b$.App.getSerialNumber(),
      appId: b$.App.getAppId(),
      appName: b$.App.getAppName(),
      appVersion: b$.App.getAppVersion(),
      certificate: certificate
    }
    communication.commitMessage('/services/machine_certificate_unbind', info, cb)
  },

  // 获取绑定的所有证书
  fetchCertificates: (cb = () => {}) => {
    if (!b$.App.getSerialNumber()) return

    const info = {
      machine: b$.App.getSerialNumber(),
      os: b$.App.getAppRunOnOS(),
      appId: b$.App.getAppId(),
      appName: b$.App.getAppName(),
      appVersion: b$.App.getAppVersion()
    }
    communication.commitMessage('/services/machine_certificate_fetch', info, cb)
  }
}

// -----------------------------------------------
const certificateManager = uu$
export {
  certificateManager
}
