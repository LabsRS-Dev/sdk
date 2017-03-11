import { ProxyMessageCenter } from './proxy'
import { SelfClass } from '../observable'
import { common } from './common'
import underscore from '../underscore'

var _ = underscore._

var $bc_ = common

const logCord = '[SDK.Proxy.WebServer.Python]'
const __key = 'proxy-sever-plugin-python'

const TypeMsg = {}

// ====================================================================
// python 插件服务器引擎
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
  // ---------------------------------------------------------------
  getPath: () => {
    const pluginDir = $bc_.App.getAppPluginDir()
    const runOS = $bc_.App.getAppRunOnOS()
    if (runOS === 'MacOSX') {
      return pluginDir + '/pythonCLI.app/Contents/MacOS/pythonCLI'
    } else if (runOS === 'win32') {
      return pluginDir + '/python/pythonCLI/romanysoft.services.exe'
    } else {
      console.error(logCord, 'not found plugin config')
    }
  },
  getInfo: function () {
    var that = this
    var pluginPath = that.getPath()
    const plugin = {
      callMethod: 'task',
      type: 'calltask',
      tool: {
        appPath: pluginPath,
        command: [],
        mainThread: false
      }
    }
    return plugin
  },
  isRunning: false,
  baseConfig: {
    port: '8080'
  },

  _isStarted: false,
  start: function (config) {
    var that = this
    if (that._isStarted) {
      console.warn(logCord, 'is started .... you can use bind message to process you data')
      return
    }
    // 整理config信息
    const cg = that.baseConfig = _.extend(that.baseConfig, config)
    // const MT = that.getInternalMessageType()
    that._isStarted = true
    that.__startPyWebServer(cg)
  },

  __startPyWebServer: function (cg) {
    var that = this
    var __agent = that

    const taskID = __key + _.now()
    if ($bc_.pNative) {
      const copyPlugin = __agent.getInfo()

      var regCommand, formatCommonStr, command, pythonCommand
      const runOS = $bc_.App.getAppRunOnOS()
      // const workDir = $bc_.App.getAppResourceDir() + '/data/python'
      const resourceDir = $bc_.App.getAppDataHomeDir() + '/Resources'
      // const configFile = 'Resources/config.plist'

      if (runOS === 'MacOSX') {
        pythonCommand = ' --port=' + cg.port
        pythonCommand += ' -log_file_prefix=running.log' // 加入日志功能
        regCommand = '["-i","pythonCLI","-r","%resourceDir%","-m","%command%"]'
      } else {
        pythonCommand = '--port=' + cg.port
        regCommand = '["%command%"]'
      }

      formatCommonStr = regCommand
      formatCommonStr = formatCommonStr.replace(/%resourceDir%/g, resourceDir)
      formatCommonStr = formatCommonStr.replace(/%command%/g, pythonCommand)
      command = window.eval(formatCommonStr) // 转换成command
      copyPlugin.tool.command = command

      $bc_.createTask(copyPlugin.callMethod, taskID, [copyPlugin.tool])
    } else {
      console.warn(logCord, 'please run you or remote python server for process')
    }

    return taskID
  }
}

var ProxyServerPluginWebServerPython = SelfClass.extend(__$p$)

//
// -----------------------------------------------
export {
  ProxyServerPluginWebServerPython
}
