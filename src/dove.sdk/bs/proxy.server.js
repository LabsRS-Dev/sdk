import { TypeNativeMessageType, TypeTriggerMsg, task } from './task'

import { ProxyMessageCenter } from './proxy'
import { ProxyServerPluginWebServerNode } from './proxy.server.plugin.webserver.node'
import { ProxyServerPluginWebServerPython } from './proxy.server.plugin.webserver.python'
import { SelfClass } from '../observable'
import _ from 'lodash'

var $bc_ = task

const debugBand = `
You are running Vue in development mode.
Make sure to turn on production mode when deploying for production.
See more tips at https://github.com/LabsRS-Dev/sdk
Proxy.debug = false
`
const logCord = '[SDK.Proxy]'

const __key = 'agent-sever'
const TypeMsg = TypeTriggerMsg
const TNMT = TypeNativeMessageType

/**
 * 复杂的一些处理，全部通过代理一致性封装掉，方便以后统一处理
 */
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

  // --------------------------------------------------------------
  _isStarted: false,
  baseConfig: {
    nativePlugins: [], // 跟随系统启动的插件
    fnOnPluginInit: () => {},
    fnOnExecTaskUpdateInfo: () => {},
    fnIAP: () => {}, // 内置购买配置接口
    fnMenuPreferences: '', // 用户参数化选择菜单配置接口
    dropDragConfig: { // 拖拽处理配置接口
      enable: false, // 默认是不开启的
      enableDir: false, // 是否允许拖拽文件夹
      enableFile: true, // 是否拖拽文件
      allowTypes: ['*'], // 允许拖拽的文件类型
      handler: (data) => {
        console.log(JSON.stringify(data))
      }
    },
    httpPort: '8080', // Webserver port
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
  getDefaultConfig: function () {
    return this.baseConfig
  },
  start: function (config) {
    var that = this
    if (that._isStarted) {
      console.warn(logCord, '[SDK.proxy] is started .... you can use bind message to process you data')
      return
    }

    that._isStarted = true

    // 整理config信息
    const cg = that.baseConfig = _.extend(that.baseConfig, config)
    const MT = that.getInternalMessageType()

    // 自动要加载的本地插件
    const nativePluginList = cg.nativePlugins

    that.mc.bind(MT.onCreate, function (data) {
      try {
        var gFnPluginCallName = data.fnCallbackName || $bc_.pCorePlugin.passBack
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
            fileTypes: cg.dropDragConfig.allowTypes,
            enableDir: cg.dropDragConfig.enableDir,
            enableFile: cg.dropDragConfig.enableFile
          })
        }
      } catch (error) {
        console.error(logCord, error)
        that._isStarted = false
      }
    })

    that.mc.bind(MT.onNativeEngineInitSuccess, function (data) {
      // 5. 动态检测启动相关的server
      var svrCg = cg.enableServer
      if (svrCg.python) {
        // 启动python服务器
        const svr = new ProxyServerPluginWebServerPython()
        svr.start({
          port: cg.httpPort.toString()
        })
      } else if (svrCg.node) {
        // 启动Node服务器
        const svr = new ProxyServerPluginWebServerNode()
        svr.start({
          port: cg.httpPort.toString()
        })
      }
    })

    // ------------------------------------------------------------------
    // call start
    try {
      that.configOnNativeEngineInitSuccessCallback(cg.fnOnPluginInit)
      const _fnCallName = that.configExecTaskUpdateInfoCallback(cg.fnOnExecTaskUpdateInfo)
      that.mc.trigger(MT.onCreate, { fnCallbackName: _fnCallName })
    } catch (error) {
      console.error(logCord, error)
      that._isStarted = false
    }
  },

  // ---------------------------------------------------------------
  // 配置内核启动成功后的处理方式
  configOnNativeEngineInitSuccessCallback: function (cb) {
    console.log(logCord, 'config on native engine init success!')
  },

  configExecTaskUpdateInfoCallback: function (cb) {
    const __agent = this
    const __mc = __agent.getMsgHelper()
    const fn = function (obj) {
      __agent.log(debugBand, JSON.stringify(obj))

      // 声明处理插件初始化的方法
      function process_init (obj) {
        console.assert(obj)
        try {
          if (obj.type === TNMT.InitCoreSuccess) {
            __agent.log(logCord, 'init core plugin success!')
            __mc.trigger(TypeMsg.onNativeEngineInitSuccess, {
              data: obj
            })
          } else if (obj.type === TNMT.InitCoreFailed) {
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
        console.assert(obj)
        try {
          if (obj.type === TNMT.CliCallStart) {
            __agent.log(logCord, 'start dylib cli call!')
            __mc.trigger(TypeMsg.onDylibCLIStart, {
              data: obj
            })
          } else if (obj.type === TNMT.CliCallReportProgress) {
            __agent.log(logCord, 'report dylib cli call progress!')
            __mc.trigger(TypeMsg.onDylibCLIFeedback, {
              data: obj
            })
          } else if (obj.type === TNMT.CliCallEnd) {
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
        console.assert(obj)
        try {
          if (obj.type === TNMT.AddExecCommandQueueSuccess) {
            __agent.log(logCord, 'add exec command queue success and start after!')
            const queueID = obj.queueInfo.id
            $bc_.sendQueueEvent(queueID, 'execcommand', 'start')
            __mc.trigger(TypeMsg.onExecCommandAdded, {
              data: obj
            })
          } else if (obj.type === TNMT.ExecCommandStart) {
            __agent.log(logCord, 'exec command start ...')
            __mc.trigger(TypeMsg.onExecCommandStarted, {
              data: obj
            })
          } else if (obj.type === TNMT.ExecCommandReportProgress) {
            __agent.log(logCord, 'report exec command progress ...')
            __mc.trigger(TypeMsg.onExecCommandFeedback, {
              data: obj
            })
          } else if (obj.type === TNMT.ExecCommandSuccess) {
            __agent.log(logCord, 'exec command success ...')
            __mc.trigger(TypeMsg.onExecCommandSuccess, {
              data: obj
            })
          } else if (obj.type === TNMT.CancelExecCommand) {
            __agent.log(logCord, 'exec command cancel ...')
            __mc.trigger(TypeMsg.onExecCommandCanceled, {
              data: obj
            })
          } else if (obj.type === TNMT.ExecCommandFailed) {
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
        console.assert(obj)
        try {
          if (obj.type === TNMT.AddCallTaskQueueSuccess) {
            __agent.log(logCord, 'add task queue success and start after!')
            const queueID = obj.queueInfo.id
            $bc_.sendQueueEvent(queueID, 'calltask', 'start')
            __mc.trigger(TypeMsg.onTaskAdded, {
              data: obj
            })
          } else if (obj.type === TNMT.CallTaskStart) {
            __agent.log(logCord, 'call task start!')
            __mc.trigger(TypeMsg.onTaskStarted, {
              data: obj
            })
          } else if (obj.type === TNMT.CallTaskFailed) {
            __agent.log(logCord, 'call task error!')
            __agent.log(logCord, JSON.stringify(obj))
            __mc.trigger(TypeMsg.onTaskError, {
              data: obj
            })
          } else if (obj.type === TNMT.CallTaskSuccess) {
            __agent.log(logCord, 'call task finished!')
            __agent.log(logCord, JSON.stringify(obj))
            __mc.trigger(TypeMsg.onTaskFinished, {
              data: obj
            })
          } else if (obj.type === TNMT.CancelCallTask) {
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
}

var ProxyServer = SelfClass.extend(__$p$)
//
// -----------------------------------------------
export {
  ProxyServer
}
