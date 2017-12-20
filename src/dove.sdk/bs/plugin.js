import { common } from './common'
import _ from 'lodash'

var $bc_ = common
// 启动核心插件功能
$bc_.enablePluginCore = function (pluginList, cbFuncName) {
  if ($bc_.pN) {
    try {
      var orgPluginArray = pluginList || [] // 插件信息数组
      var pluginArray = []

      // 过滤调用方式非'call' 的插件
      for (var i = 0; i < orgPluginArray.length; ++i) {
        var plugin = orgPluginArray[i]
        if (plugin['callMethod'] === 'call') {
          pluginArray.push(plugin)
        }
      }

      var extendObj = _.clone($bc_.pCorePlugin)
      extendObj['callMethod'] = 'initCore'
      if (_.isString(cbFuncName) && !_.isEmpty(cbFuncName)) {
        extendObj['passBack'] = cbFuncName // 取代默认回调函数
      }
      extendObj['arguments'] = [
        true,
        pluginArray
      ]

      $bc_.pN.window.execTask(JSON.stringify(extendObj))
    } catch (e) {
      console.error(e)
    }
  }
}

// -----------------------------------------------
const plugin = $bc_
export {
  plugin
}

