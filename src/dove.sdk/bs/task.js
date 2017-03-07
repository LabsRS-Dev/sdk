import { common } from './common'
import _ from '../underscore'

var $bc_ = common

const TypeTriggerMsg = {
  UNKnown: 'NativeTask_UNKnown',
  onCreate: 'NativeTask_onCreate',
  // process_init
  //
  onNativeEngineInitSuccess: '_native_engine_init_success',
  onNativeEngineInitFailed: '_native_engine_init_failed',
  // process_dylibCLI
  //
  onDylibCLIStart: '_native_clicall_start',
  onDylibCLIFeedback: '_native_clicall_feedback',
  onDylibCLIEnd: '_native_clicall_end',
  // process_execCommand
  //
  onExecCommandAdded: '_native_execCommand_added',
  onExecCommandStarted: '_native_execCommand_start',
  onExecCommandFeedback: '_native_execCommand_feedback',
  onExecCommandSuccess: '_native_execCommand_success',
  onExecCommandCanceled: '_native_execCommand_canceled',
  onExecCommandError: '_native_execCommand_error',
  // process_task
  //
  onTaskAdded: '_native_task_added',
  onTaskStarted: '_native_task_started',
  onTaskFinished: '_native_task_finished',
  onTaskError: '_native_task_error',
  onTaskCanceled: '_native_task_canceled'
}

// 来自于底层的消息类型统一
const TypeNativeMessageType = {
  // process_init
  InitCoreSuccess: 'type_initcoresuccess',
  InitCoreFailed: 'type_initcorefailed',

  // process_dylibCLI
  CliCallStart: 'type_clicall_start',
  CliCallReportProgress: 'type_clicall_reportprogress',
  CliCallEnd: 'type_clicall_end',

  // process_execCommand
  AddExecCommandQueueSuccess: 'type_addexeccommandqueue_success',
  ExecCommandStart: 'type_execcommandstart',
  ExecCommandReportProgress: 'type_reportexeccommandprogress',
  ExecCommandSuccess: 'type_execcommandsuccess',
  CancelExecCommand: 'type_canceledexeccommand',
  ExecCommandFailed: 'type_execcommanderror',

  // process_task
  AddCallTaskQueueSuccess: 'type_addcalltaskqueue_success',
  CallTaskStart: 'type_calltask_start',
  CallTaskFailed: 'type_calltask_error',
  CallTaskSuccess: 'type_calltask_success',
  CancelCallTask: 'type_type_calltask_cancel'

}

const TaskMethodWay = {
  InitCore: 'initCore',
  Task: 'task',
  SendEvent: 'sendEvent'
}

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

/**
 * 新增一个简单的任务调用方式，用来解决简单的任务的启动处理
 * @param method 任务接口调用方式，参照$bc_.createTask. //task, sendEvent, initCore 等等
 * @param callbackName 处理该任务的全局处理函数
 * @param args 需要填写的参数
 */
$bc_.runTaskSample = function (method = TaskMethodWay.Task, callbackName, args = [
  _.now(),   // TaskID
  [{         // TaskCommand
    appPath: '',
    command: [],
    mainThread: false
  }]
]) {
  try {
    if ($bc_.pN) {
      $bc_.pN.window.execTask(JSON.stringify({
        useThread: true,
        passBack: callbackName,
        packageMode: 'bundle',
        taskToolPath: '/Plugins/extendLoader.bundle',
        bundleClassName: 'LibCommonInterface',
        callMethod: method,
        arguments: args
      }))
    } else {
      callbackName && window.eval(callbackName + '()')
    }
  } catch (error) {
    console.error(error)
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

$bc_.Task = {
  TypeDefined: {
    TypeTriggerMsg: TypeTriggerMsg,
    TypeNativeMessageType: TypeNativeMessageType,
    TaskMethodWay: TaskMethodWay
  },
  Methods: {
    formatCommand: $bc_.formatCommand,
    createTask: $bc_.createTask,
    runTaskSample: $bc_.runTaskSample,
    autoStartTask: $bc_.autoStartTask,
    sendQueueEvent: $bc_.sendQueueEvent
  }
}

// -----------------------------------------------
const task = $bc_
export {
  task,
  TypeTriggerMsg,
  TypeNativeMessageType,
  TaskMethodWay
}
