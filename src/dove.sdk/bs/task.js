import { common } from './common'
import _ from '../underscore'

var $bc_ = common

/**
 * 格式化，使用插件模式，传递的command数组。
 * 例如："copyPlugin.tool.command" 需要格式化
 var copyPlugin = $.objClone(t$.plguinData);
 copyPlugin.tool.command = ["-g",
 {
   "$api":"GetXLSFileInfo",
   "filePath":_path
 }];

  $bc_.createTask(copyPlugin.callMethod, Date.now(), [copyPlugin.tool], $bc_._get_callback(function(obj)
  * @param commandList
  */
$bc_.formatCommand = function (commandList) {
  // 命令自动加入''
  var formatArgs = []

  _.each(commandList || [], function (ele, index, list) {
    var fm_ele = ''
    if (_.isBoolean(ele)) fm_ele = "'" + ele + "'"
    if (_.isNumber(ele)) fm_ele = ele
    if (_.isString(ele)) fm_ele = "'" + ele + "'"
    if (_.isFunction(ele)) fm_ele = null
    if (_.isArray(ele)) fm_ele = "'" + JSON.stringify(ele) + "'"
    if (_.isDate(ele)) fm_ele = "'" + JSON.stringify(ele) + "'"
    if (_.isRegExp(ele)) fm_ele = "'" + ele.toString() + "'"
    if (_.isObject(ele)) fm_ele = "'" + JSON.stringify(ele) + "'"
    if (fm_ele !== null) {
      formatArgs.push(fm_ele)
    }
  })

  return formatArgs
}
// 创建任务
/**
 *
 * @param callMethod  调用方式：task，sendEvent，
 * @param taskId
 * @param args
 * @param cbFuncName callback 回调函数的名称
 */
$bc_.createTask = function (callMethod, taskId, args, cbFuncName) {
  try {
    var extendObj = _.clone($bc_.pCorePlugin)
    extendObj['passBack'] = cbFuncName || extendObj['passBack']
    extendObj['callMethod'] = callMethod
    extendObj['arguments'] = [taskId, args]

    var argumentJSONString = JSON.stringify(extendObj)
    if ($bc_.pN) {
      $bc_.pN.window.execTask(argumentJSONString)
    } else {
      cbFuncName && window.eval(cbFuncName + '()')
    }
  } catch (e) {
    console.error(e)
  }
}

// 自动判断几种任务类型，自动启动任务(2016.1.20)添加，方便函数
$bc_.autoStartTask = function (obj, cbFuncName) {
  try {
    if ($bc_.pN) {
      var infoType = obj.type
      let queueID = null
      if (infoType === 'type_addexeccommandqueue_success') {
        queueID = obj.queueInfo.id
        $bc_.sendQueueEvent(queueID, 'execcommand', 'start', cbFuncName)
      }
      if (infoType === 'type_addcalltaskqueue_success') {
        queueID = obj.queueInfo.id
        $bc_.sendQueueEvent(queueID, 'calltask', 'start', cbFuncName)
      }
    } else {
      cbFuncName && window.eval(cbFuncName + '()')
    }
  } catch (e) {}
}

// 发送任务事件
$bc_.sendQueueEvent = function (queueID, queueType, event, cbFuncName) {
  try {
    var extendObj = _.clone($bc_.pCorePlugin)
    extendObj['passBack'] = cbFuncName || extendObj['passBack']
    extendObj['callMethod'] = 'sendEvent'
    extendObj['arguments'] = [event, queueType, queueID]

    if ($bc_.pN) {
      $bc_.pN.window.execTask(JSON.stringify(extendObj))
    } else {
      cbFuncName && window.eval(cbFuncName + '()')
    }
  } catch (e) {
    console.error(e)
  }
}

// -----------------------------------------------
const task = $bc_
export {
  task
}
