import { common } from './common'

var $bc_ = common

/**
 * Dock 浮动图标上的设置内容
 * @type {{setBadge: Function, getBadge: Function}}
 */
$bc_.Dock = {
  setBadge: function (text) {
    if ($bc_.pN) {
      $bc_.pN.dock.setBadge(text)
    }
  },
  getBadge: function () {
    if ($bc_.pN) {
      return $bc_.pN.dock.badge
    }

    return 'dock'
  }
}

//
// -----------------------------------------------
const dock = $bc_
export {
  dock
}
