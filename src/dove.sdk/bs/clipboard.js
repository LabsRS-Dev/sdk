import { common } from './common'

var $bc_ = common

/**
 * 剪贴板操作
 * @type {{copy: Function, paste: Function}}
 */
$bc_.Clipboard = {
  copy: function (stringText) {
    if ($bc_.pN) {
      $bc_.pN.clipboard.copy(stringText)
    }
  },
  paste: function () {
    if ($bc_.pN) {
      return $bc_.pN.clipboard.paste()
    }
  }
}

//
// -----------------------------------------------
const clipboard = $bc_
export {
  clipboard
}

