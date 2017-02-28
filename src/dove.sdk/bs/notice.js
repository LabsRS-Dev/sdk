import { common } from './common'

var $bc_ = common

/**
 * Notice 内容封装
 */
$bc_.Notice = {
  alert: function (jsonObj) {
    if ($bc_.pN) {
      var params = {
        message: jsonObj.message || 'Tip',
        title: jsonObj.title || 'Information',
        buttons: jsonObj.buttons || ['Ok'],
        alertType: jsonObj.alertType || 'Alert'
      }

      // / 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          params[key] = jsonObj[key]
        }
      }

      var returnValue = $bc_.pN.notice.alert(JSON.stringify(params))

      // /Fixed: 根据Electron及本地引擎的区别来处理返回的值
      if ($bc_.pIsUseElectron) {
        return returnValue
      } else if ($bc_.pIsUseMacCocoEngine) {
        /**
            enum {
                NSAlertDefaultReturn = 1,
                NSAlertAlternateReturn = 0,
                NSAlertOtherReturn = -1,
                NSAlertErrorReturn = -2
            };
          */

        if (returnValue === 1) return 0
        if (returnValue === 0) return 1
        if (returnValue === -1) return 2
        if (returnValue === -2) return 3
      }
    } else {
      alert(jsonObj.message)
    }
  },

  notify: function (jsonObj, cb) {
    if ($bc_.pN) {
      var params = {
        content: jsonObj.message || 'Tip',
        title: jsonObj.title || 'title',
        callback: jsonObj['callback'] || $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
      }

      // / 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          params[key] = jsonObj[key]
        }
      }

      return $bc_.pN.notice.notify(JSON.stringify(params))
    } else {
      alert(jsonObj.message)
    }
  },

  dockMessage: function (jsonObj, cb) {
    if ($bc_.pN) {
      var params = {
        content: jsonObj.message || 'Tip',
        title: jsonObj.title || 'title',
        callback: jsonObj['callback'] || $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
      }

      // / 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          params[key] = jsonObj[key]
        }
      }

      if ($bc_.pIsUseElectron) {
        if (window.Notification) {
          // 参照HTML5 Notification API
          // http://electron.atom.io/docs/v0.37.8/tutorial/desktop-environment-integration/
          var _notification = new window.Notification(params.title, {
            body: params.content
          })
          _notification.onclick = function () {
            params.callback && params.callback()
          }
        }
      } else {
        return $bc_.pN.growl.notify(JSON.stringify(params))
      }
    } else {
      alert(jsonObj.message)
    }
  }
}

// -----------------------------------------------
const notice = $bc_
export {
  notice
}
