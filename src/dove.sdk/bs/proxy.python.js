import { common } from './common'
import { Observable } from '../observable'
import underscore from '../underscore'
import { Tool } from '../include'
var _ = underscore._

var $bc_ = common

const logCord = '[SDK.Proxy.WebServer.Python]'

const pyServerPrefix = 'PyWebServer'

// 核心消息处理中心
const __mc = new Observable()
/**
 * python 插件服务器引擎
 */
$bc_['proxy-webserver-python'] = {
  name: 'proxy-webserver-python',
  getMsgHelper: () => {
    return __mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message) {
    if (this.debug) {
      console.log(title, message)
    }
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
  getInfo: () => {
    var pluginPath = this.getPath()
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
  ip: '127.0.0.1',
  port: '8080',
  start: function () {
    __startPyWebServer()
  }
}

// 创建一个助手
const __agent = $bc_['proxy-webserver-python']

function __startPyWebServer () {
  let taskID = 'undefined'
  if ($bc_.pNative) {
    const copyPlugin = __agent.getInfo()

    var regCommand, formatCommonStr, command, pythonCommand
    const runOS = $bc_.App.getAppRunOnOS()
    // const workDir = $bc_.App.getAppResourceDir() + '/data/python'
    const resourceDir = $bc_.App.getAppDataHomeDir() + '/Resources'
    // const configFile = 'Resources/config.plist'

    if (runOS === 'MacOSX') {
      pythonCommand = ' --port=' + __agent.port
      pythonCommand += ' -log_file_prefix=running.log' // 加入日志功能
      regCommand = '["-i","pythonCLI","-r","%resourceDir%","-m","%command%"]'
    } else {
      pythonCommand = '--port=' + __agent.port
      regCommand = '["%command%"]'
    }

    formatCommonStr = regCommand
    formatCommonStr = formatCommonStr.replace(/%resourceDir%/g, resourceDir)
    formatCommonStr = formatCommonStr.replace(/%command%/g, pythonCommand)
    command = window.eval(formatCommonStr) // 转换成command
    copyPlugin.tool.command = command

    taskID = pyServerPrefix + _.now()
    $bc_.createTask(copyPlugin.callMethod, taskID, [copyPlugin.tool])
  } else {
    console.warn(logCord, 'please run you or remote python server for process')
  }

  return taskID
}




//
// -----------------------------------------------
const proxyPluginPython = $bc_
export {
  proxyPluginPython
}
