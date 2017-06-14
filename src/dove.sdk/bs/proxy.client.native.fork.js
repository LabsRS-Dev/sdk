import { TypeNativeMessageType, TaskMethodWay, task } from './task'

import { ProxyMessageCenter } from './proxy'
import { SelfClass } from '../observable'
import underscore from '../underscore'

const _ = underscore._
var $bc_ = task

const logCord = '[SDK.Proxy.Client.NativeFork]'
const __key = 'proxy-client-native-fork'
const __msgPrefix = __key + '-' + _.now() + _.random(1, Number.MAX_SAFE_INTEGER) + '-'

const TNMT = TypeNativeMessageType
const TypeMsg = {
  OnCreateError: __msgPrefix + 'OnCreateError', // 创建失败
  OnRunning: __msgPrefix + 'OnRunning',         // 创建并连接上

  OnGetServerMessage: __msgPrefix + 'OnGetServerMessage',  // 从服务器获取到信息
  OnSendMessageToServer: __msgPrefix + 'OnSendMessageToServer' // 向服务器发送信息
}

const initializedTip = `
You must use init(config) function first, the use listen to start!!!!
`

// ------------------------------------------------------------------------
// Class ProxyClientNativeForkPrivate
var __$p$ = {
  name: __key,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
    return this.mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end = '') {
    if (this.debug) {
      console.log(title, message, end)
    }
  },
  getInternalMessageType: function () {
    return TypeMsg
  },
  // ------------------ log -------------------------------------------------
  _traceLogEventsCount: function () {
    const _events = this.mc.getEvents()
    this.log(logCord, ' _events count = ' + _.keys(_events).length)
  },
  _traceLogCacheSendMessageCount: function () {
    this.log(logCord, ' cacheMessage count = ' + this.cacheSendMessage.length)
  },
  // -------------------------------------------------------------------------
  initialized: false, // 是否初始化配置
  config: {},
  isRunning: false,
  initWithConfig: function (inConfig = {}) {
    this.log(logCord, __key + ' call initWithConfig function ....')
    this.config = _.extend(this.config, inConfig)
    this.debug = this.config.debug
    this.initialized = true
  },
  run: function () {
    if (!this.initialized) {
      return this.showInitializedTip()
    }

    this.isRunning = true
    this.noticeOnRunning({})
  },

  // --------------- 核心消息 ------------------------
  cacheSendMessage: [],         // 缓存发送信息部分
  sendMessage: function (message, first = false) {   // 客户端向服务器发送消息
    var that = this
    if (!that.isRunning) {
      that.cacheSendMessage.push(message)
      return console.warn(logCord, 'NativeFork is not running .....')
    }

    first ? that.cacheSendMessage.unshift(message) : that.cacheSendMessage.push(message)

    that._traceLogCacheSendMessageCount()
    _.each(that.cacheSendMessage, (curMessage) => {
      // 发送信息
      that._processNativeForkMessage(curMessage)

      that._traceLogEventsCount()
      that.mc.trigger(TypeMsg.OnSendMessageToServer, curMessage)
      that.cacheSendMessage.shift()
    })
    that._traceLogCacheSendMessageCount()
  },
  onReceiveMessage: function (message) {
    var that = this
    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnGetServerMessage, message)
  },
  // ---------------- 创建失败是回话被关闭交互 ----------------
  noticeCreateError: function (message) {
    var that = this
    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnCreateError, message)
  },
  noticeOnRunning: function (message) {
    var that = this
    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnRunning, message)
  },
  // -------------------------------------------------------
  showInitializedTip: function () {
    console.warn(logCord, initializedTip)
  },
  _processNativeForkMessage: function (message) {
    var that = this
    that.__processNativeTask(message)
  },
  __processNativeTask: function (message) {
    var that = this
    const dataObj = _.extend({
      task_id: '',
      commands: '',
      taskMethodWay: TaskMethodWay.Task
    }, message)

    var cbName = $bc_._get_callback(function (_obj) {
      console.log('-------- from native callback ---------------')
      const obj = _.extend({
        type: 'UNKNOWN'
      }, _obj)
      var msgPackage = ''
      try {
        msgPackage = JSON.stringify(obj)
      } catch (e) {
        console.error(e)
      }

      if (obj.type === TNMT.AddCallTaskQueueSuccess) {
        return $bc_.runTaskSample(TaskMethodWay.SendEvent,
              cbName, ['start', 'calltask', obj.queueInfo.id])
      } else if (obj.type === TNMT.CallTaskStart) {
        console.log('call task start .... ')
        that.noticeOnRunning(msgPackage)
        that.onReceiveMessage(msgPackage)
      } else if (obj.type === TNMT.CallTaskFailed) {
        console.log('call task failed .... ')
        that.noticeCreateError(msgPackage)
      } else if (obj.type === TNMT.CallTaskSuccess) {
        console.log('call task success .... ')
        that.onReceiveMessage(msgPackage)
      } else if (obj.type === TNMT.CancelCallTask) {
        console.log('call task cancel .... ')
        that.onReceiveMessage(msgPackage)
      } else if (obj.type === TNMT.CallTaskLog) {
        console.log('call task log .... ')
        that.onReceiveMessage(msgPackage)
      } else if (obj.type === TNMT.CallTaskExit) {
        console.log('call task exit .... ')
        that.onReceiveMessage(msgPackage)
      } else {
        console.warn('Warning: obj.type == UNKNOWN')
      }
    }, true)

    const taskID = dataObj.task_id
    const commands = dataObj.commands

    if (TaskMethodWay.Task === dataObj.taskMethodWay) {
      $bc_.runTaskSample(TaskMethodWay.Task, cbName, [taskID, commands])
    } else if (TaskMethodWay.SendEvent === dataObj.taskMethodWay) {
      $bc_.runTaskSample(TaskMethodWay.SendEvent, cbName, commands.push(taskID))
    }
  }
}

// 批量处理注册及接收方式
_.each(TypeMsg, function (eventType, key, list) {
  var registerKey = 'register' + key
  var unregisterKey = 'unregister' + key

  __$p$[registerKey] = function (handler, one = false) {
    __$p$.mc.bind(eventType, handler, one)
  }
  __$p$[unregisterKey] = function (handler) {
    __$p$.mc.unbind(eventType, handler)
  }
})

var ProxyClientNativeFork = SelfClass.extend(__$p$)

// -----------------------------------------------------------------------
// 统一的Client Websocket 处理, 用来与后台服务器的交互处理
//
// -----------------------------------------------
export {
  ProxyClientNativeFork
}
