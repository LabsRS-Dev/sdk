import { common } from './common'

var $bc_ = common

/**
 * 系统菜单控制
 * @type {{setMenuProperty: Function, maxRecentDocumentCount: Function, addRecentDocument: Function, clearAllRecentDocuments: Function}}
 */
$bc_.SystemMenus = {
  setMenuProperty: function (paramOptions, cb, actionCB) {
    try {
      var params = {}
      // 限制内部属性：
      // Note: 做兼容处理，callback 和 action 使用通用方法来处理
      params['callback'] = paramOptions['callback'] || $bc_._get_callback(function (obj) {
        console.log('call callback.cb ...')
        cb && cb(obj)
      }, true)
      params['menuTag'] = paramOptions['menuTag'] || 999
      params['hideMenu'] = paramOptions['hideMenu'] || false
      params['isSeparatorItem'] = paramOptions['isSeparatorItem'] || false // 是否为分割线，用来创建新的Item
      params['title'] = paramOptions['title'] || '##**' // "MenuTitle";
      params['action'] = paramOptions['action'] || $bc_._get_callback(function (obj) {
        console.log('call actionCB ...')
        actionCB && actionCB(obj)
      }, true)

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.window.setMenuProperty(JSON.stringify(params))
      } else {
        alert('启动系统菜单控制!')
      }
    } catch (e) {
      console.error(e)
    }
  },
  maxRecentDocumentCount: function () {
    if ($bc_.pN) {
      return $bc_.pN.window.maxRecentDocumentCount()
    }

    return 0
  },
  addRecentDocument: function (paramOptions) {
    if ($bc_.pN) {
      try {
        var params = paramOptions || {}
        // 限制内部属性：
        params['url'] = paramOptions['url'] || ''
        params['mustWritable'] = paramOptions['mustWritable'] || false

        // / 统一向后兼容处理
        for (var key in paramOptions) {
          if (paramOptions.hasOwnProperty(key)) {
            params[key] = paramOptions[key]
          }
        }

        $bc_.pN.window.addRecentDocument(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    } else {
      alert('启动添加最近使用文档功能')
    }
  },
  clearAllRecentDocuments: function () {
    if ($bc_.pN) $bc_.pN.window.clearAllRecentDocuments()
  }

}

// -----------------------------------------------
const menu = $bc_
export {
  menu
}
