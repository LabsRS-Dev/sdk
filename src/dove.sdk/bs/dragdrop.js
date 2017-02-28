import { common } from './common'
import _ from '../underscore'

var $bc_ = common

// 启用拖拽功能
$bc_.cb_dragdrop = null // 启动
/**
 *
 * @param parms 参数处理
 */
$bc_.enableDragDropFeature = function (jsonObj, cb) {
  var t$ = this
  if (t$.pN) {
    try {
      var parms = jsonObj || {}
      parms['callback'] = jsonObj['callback'] || t$._get_callback(function (obj) {
        if (_.isFunction(t$.cb_dragdrop)) {
          t$.cb_dragdrop && t$.cb_dragdrop(obj)
        } else {
          cb && cb(obj)
        }
      }, true)
      parms['enableDir'] = jsonObj['enableDir'] || false
      parms['enableFile'] = jsonObj['enableFile'] !== false
      parms['fileTypes'] = jsonObj['fileTypes'] || ['*'] // ["*","mp3","md", "xls"] 类似这样的格式

      // / 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          parms[key] = jsonObj[key]
        }
      }

      if (t$.pIsUseElectron) {
        $(document).ready(function () {
          // document.ondragover = document.ondrop = function(e) {
          //   e.preventDefault();
          //   return false;
          // };

          var holder = document // document.getElementsByTagName('body');
          holder.ondragstart = function (e) {
            console.log('----- holder.ondragstart -----')
            e.preventDefault()
          }

          holder.ondragover = function () {
            console.log('----- holder.ondragover -----')
            return false
          }
          holder.ondragleave = holder.ondragend = function () {
            console.log('----- holder.ondragleave or holder.ondragend -----')
            // this.className = '';
            return false
          }
          holder.ondrop = function (e) {
            console.log('----- holder.ondrop -----')
            // this.className = '';
            e.preventDefault()

            // 传递dataTransfer.files 给本地引擎，让本地引擎去详细处理
            var pathList = []
            _.each(e.dataTransfer.files, function (fileObj, index, list) {
              pathList.push(fileObj.path)
            })

            try {
              t$.pN.window.proxyProcessDragDropWithPaths(pathList)
            } catch (e) {
              console.error(e)
            }
          }
        })
      }

      t$.pN.window.setDragDropConfig(JSON.stringify(parms))
    } catch (e) {
      console.error(e)
    }
  } else {
    console.log('[Notice] Not Native enableDragDropFeature')
  }
}

//
// -----------------------------------------------
const dragdrop = $bc_
export {
  dragdrop
}

