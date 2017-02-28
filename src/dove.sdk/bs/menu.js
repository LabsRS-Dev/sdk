import { common } from './common'

var $bc_ = common

/**
 * 系统菜单控制
 * @type {{setMenuProperty: Function, maxRecentDocumentCount: Function, addRecentDocument: Function, clearAllRecentDocuments: Function}}
 */
$bc_.SystemMenus = {
  setMenuProperty: function (in_parms, cb, actionCB) {
    try {
      var parms = {}
      // 限制内部属性：
      parms['callback'] = in_parms['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      parms['menuTag'] = in_parms['menuTag'] || 999
      parms['hideMenu'] = in_parms['hideMenu'] || false
      parms['isSeparatorItem'] = in_parms['isSeparatorItem'] || false // 是否为分割线，用来创建新的Item
      parms['title'] = in_parms['title'] || '##**' // "MenuTitle";
      parms['action'] = in_parms['action'] || $bc_._get_callback(function (obj) {
        actionCB && actionCB(obj)
      }, true)

      // / 统一向后兼容处理
      for (var key in in_parms) {
        if (in_parms.hasOwnProperty(key)) {
          parms[key] = in_parms[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.window.setMenuProperty(JSON.stringify(parms))
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
  addRecentDocument: function (in_parms) {
    if ($bc_.pN) {
      try {
        var parms = in_parms || {}
        // 限制内部属性：
        parms['url'] = in_parms['url'] || ''
        parms['mustWritable'] = in_parms['mustWritable'] || false

        // / 统一向后兼容处理
        for (var key in in_parms) {
          if (in_parms.hasOwnProperty(key)) {
            parms[key] = in_parms[key]
          }
        }

        $bc_.pN.window.addRecentDocument(JSON.stringify(parms))
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
