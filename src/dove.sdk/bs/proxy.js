import { common } from './common'
import { Observable } from '../observable'
import underscore from '../underscore'
var _ = underscore._

var $bc_ = common

const debugBand = `
You are running Vue in development mode.
Make sure to turn on production mode when deploying for production.
See more tips at https://github.com/LabsRS-Dev/sdk
Proxy.debug = false
`
const logCord = '[SDK.Proxy]'

const msgPrefix = '__nps__'
const TypeMsg = {
  UNKnown: msgPrefix + 'UNKnown',
  onCreate: msgPrefix + 'onCreate',
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

// 核心消息处理中心
const __mc = new Observable()

/**
 * 复杂的一些处理，全部通过代理一致性封装掉，方便以后统一处理
 */
$bc_.Proxy = {
  getMsgHelper: function () {
    return __mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message) {
    if (this.debug) {
      console.log(title, message)
    }
  },
  getInternalMessageType: function () {
    return TypeMsg
  },
  bind: function (eventName, handlers, one = false) {
    const mc = this.getMsgHelper()
    mc.bind(eventName, handlers, one)
  },
  one: function (eventNames, handlers) {
    const mc = this.getMsgHelper()
    mc.one(eventNames, handlers)
  },
  first: function (eventName, handlers) {
    const mc = this.getMsgHelper()
    mc.first(eventName, handlers)
  },
  trigger: function (eventName, e) {
    const mc = this.getMsgHelper()
    mc.trigger(eventName, e)
  },
  unbind: function (eventName, handler) {
    const mc = this.getMsgHelper()
    mc.unbind(eventName, handler)
  },

  // 本地插件
  nativePlugins: [],
  registerPlugin: function (plugin) {
    this.nativePluginList.push(plugin)
  },

  _isStarted: false,
  startConfig: {
    fnIAP: () => {}, // 内置购买配置接口
    fnMenuPreferences: '', // 用户参数化选择菜单配置接口
    dropDragConfig: { // 拖拽处理配置接口
      enable: false, // 默认是不开启的
      allowTypes: [], // 允许拖拽的文件类型
      handler: (data) => {
        console.log(JSON.stringify(data))
      }
    },
    enableServer: { // 哪些本地服务器插件可以同时启动
      python: false,
      node: false,
      csharp: false,
      go: false,
      rust: false,
      ruby: false,
      java: false

    }
  },
  start: function (config) {
    var that = this
    if (this._isStarted) {
      console.warn(logCord, '[SDK.proxy] is started .... you can use bind message to process you data')
      return
    }

    this._isStarted = true

    // 整理config信息
    const cg = that.startConfig = _.extend(that.startConfig, config)
    const MT = that.getInternalMessageType()

    // 自动要加载的本地插件
    const nativePluginList = this.nativePlugins

    that.bind(MT.onCreate, function (gFnPluginCallName = $bc_.pCorePlugin.passBack) {
      try {
        // 1.注册核心插件
        $bc_.enablePluginCore(nativePluginList, gFnPluginCallName)
        // 2.检测时候配置IAP
        if ($bc_.IAP.getEnable()) {
          if (_.isFunction(cg.fnIAP)) {
            cg.fnIAP()
          }
        }
        // 3. 注册[参数选择]菜单命令回调
        if (_.isFunction(cg.fnMenuPreferences)) {
          $bc_.SystemMenus.setMenuProperty({
            menuTag: 903, // onMenuPreferencesAction
            action: $bc_._get_callback(function (obj) {
              cg.fnMenuPreferences()
            }, true)
          })
        }

        // 4. 注册拖拽回调及注册文件类型
        if (cg.dropDragConfig.enable) {
          $bc_.enableDragDropFeature({
            callback: $bc_._get_callback(function (obj) {
              cg.dropDragConfig.handler(obj)
            }, true),
            fileTypes: cg.dropDragConfig.allowTypes
          })
        }
      } catch (error) {
        console.error(logCord, error)
        this._isStarted = false
      }
    })

    that.bind(MT.onNativeEngineInitSuccess, function (data) {

      // 5. 动态检测启动相关的server
    })

    // ------------------------------------------------------------------
    // call start
    try {
      configOnNativeEngineInitSuccessCallback()
      const _fnCallName = configExecTaskUpdateInfoCallback()
      that.trigger(MT.onCreate, _fnCallName)
    } catch (error) {
      console.error(logCord, error)
      this._isStarted = false
    }
  }
}

// 创建一个助手
const __agent = $bc_.Proxy

// 根据配置获取可用的插件列表
function __getNativePluginList (config) {
  const plugins = []
  _.each(config.enableServer, (enable, key, list) => {
    if (enable) {
      const proxy = $bc_['proxy-webserver-' + key]
      if (proxy) {
        plugins.push(proxy.getInfo())
      }
    }
  })
  return plugins
}

// 配置内核启动成功后的处理方式
function configOnNativeEngineInitSuccessCallback (cb) {
  console.log(logCord, 'config on native engine init success!')
}

// 配置执行任务的更新信息的回调处理
function configExecTaskUpdateInfoCallback () {
  const fn = function (obj) {
    __agent.log(debugBand, JSON.stringify(obj))

    // 声明处理插件初始化的方法
    function process_init (obj) {
      try {
        if (obj.type === 'type_initcoresuccess') {
          __agent.log(logCord, 'init core plugin success!')
          __mc.trigger(TypeMsg.onNativeEngineInitSuccess, {
            data: obj
          })
        } else if (obj.type === 'type_initcorefailed') {
          console.error(logCord, 'init core plugin failed!')
          __mc.trigger(TypeMsg.onNativeEngineInitFailed, {
            data: obj
          })
        }
      } catch (error) {
        console.error(logCord, error)
      }
    }

    // 声明处理CLI的回调处理
    function process_dylibCLI (obj) {
      try {
        if (obj.type === 'type_clicall_start') {
          __agent.log(logCord, 'start dylib cli call!')
          __mc.trigger(TypeMsg.onDylibCLIStart, {
            data: obj
          })
        } else if (obj.type === 'type_clicall_reportprogress') {
          __agent.log(logCord, 'report dylib cli call progress!')
          __mc.trigger(TypeMsg.onDylibCLIFeedback, {
            data: obj
          })
        } else if (obj.type === 'type_clicall_end') {
          __agent.log(logCord, 'end dylib cli call!')
          __mc.trigger(TypeMsg.onDylibCLIEnd, {
            data: obj
          })
        }
      } catch (error) {
        console.error(logCord, error)
      }
    }

    // 声明处理ExecCommand的方法
    function process_execCommand (obj) {
      try {
        if (obj.type === 'type_addexeccommandqueue_success') {
          __agent.log(logCord, 'add exec command queue success and start after!')
          const queueID = obj.queueInfo.id
          $bc_.sendQueueEvent(queueID, 'execcommand', 'start')
          __mc.trigger(TypeMsg.onExecCommandAdded, {
            data: obj
          })
        } else if (obj.type === 'type_execcommandstart') {
          __agent.log(logCord, 'exec command start ...')
          __mc.trigger(TypeMsg.onExecCommandStarted, {
            data: obj
          })
        } else if (obj.type === 'type_reportexeccommandprogress') {
          __agent.log(logCord, 'report exec command progress ...')
          __mc.trigger(TypeMsg.onExecCommandFeedback, {
            data: obj
          })
        } else if (obj.type === 'type_execcommandsuccess') {
          __agent.log(logCord, 'exec command success ...')
          __mc.trigger(TypeMsg.onExecCommandSuccess, {
            data: obj
          })
        } else if (obj.type === 'type_canceledexeccommand') {
          __agent.log(logCord, 'exec command cancel ...')
          __mc.trigger(TypeMsg.onExecCommandCanceled, {
            data: obj
          })
        } else if (obj.type === 'type_execcommanderror') {
          __agent.log(logCord, 'exec command error ...')
          __mc.trigger(TypeMsg.onExecCommandError, {
            data: obj
          })
        }
      } catch (error) {
        console.error(logCord, error)
      }
    }

    // 声明处理Task的方法
    function process_task (obj) {
      try {
        if (obj.type === 'type_addcalltaskqueue_success') {
          __agent.log(logCord, 'add task queue success and start after!')
          const queueID = obj.queueInfo.id
          $bc_.sendQueueEvent(queueID, 'calltask', 'start')
          __mc.trigger(TypeMsg.onTaskAdded, {
            data: obj
          })
        } else if (obj.type === 'type_calltask_start') {
          __agent.log(logCord, 'call task start!')
          __mc.trigger(TypeMsg.onTaskStarted, {
            data: obj
          })
        } else if (obj.type === 'type_calltask_error') {
          __agent.log(logCord, 'call task error!')
          __agent.log(logCord, JSON.stringify(obj))
          __mc.trigger(TypeMsg.onTaskError, {
            data: obj
          })
        } else if (obj.type === 'type_calltask_success') {
          __agent.log(logCord, 'call task finished!')
          __agent.log(logCord, JSON.stringify(obj))
          __mc.trigger(TypeMsg.onTaskFinished, {
            data: obj
          })
        } else if (obj.type === 'type_type_calltask_cancel') {
          __agent.log(logCord, 'call task cancel!')
          __agent.log(logCord, JSON.stringify(obj))
          __mc.trigger(TypeMsg.onTaskCanceled, {
            data: obj
          })
        }
      } catch (error) {
        console.error(logCord, error)
      }
    }

    // 以下是调用顺序
    process_init(obj)
    process_dylibCLI(obj)
    process_execCommand(obj)
    process_task(obj)
  }

  const cbName = $bc_._get_callback(function (obj) {
    fn(obj)
  }, true)

  console.assert(_.isString(cbName), 'cbName must be a string')
  return cbName
}

//
// -----------------------------------------------
const proxy = $bc_
export {
  proxy
}
