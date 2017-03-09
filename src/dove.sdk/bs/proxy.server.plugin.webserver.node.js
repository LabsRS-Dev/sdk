import { TaskMethodWay, TypeNativeMessageType, TypeTriggerMsg, task } from './task'

import { ProxyMessageCenter } from './proxy'
import { SelfClass } from '../observable'
import underscore from '../underscore'

var _ = underscore._

var $bc_ = task

const logCord = '[SDK.Proxy.WebServer.Node]'
const __key = 'proxy-sever-plugin-Node'

const TypeMsg = _.extend({}, TypeTriggerMsg)
const TNMT = TypeNativeMessageType

// ====================================================================
// Node 插件服务器引擎
var __$p$ = {
  name: __key,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
    return __$p$.mc
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end = '') {
    if (__$p$.debug) {
      console.log(title, message, end)
    }
  },
  getInternalMessageType: function () {
    return TypeMsg
  },
  // ---------------------------------------------------------------
  isRunning: false,
  baseConfig: {
    port: '8080'
  },

  _isStarted: false,
  start: function (config) {
    var that = __$p$
    if (that._isStarted) {
      console.warn(logCord, 'is started .... you can use bind message to process you data')
      return
    }
    // 整理config信息
    const cg = that.baseConfig = _.extend(that.baseConfig, config)
    // const MT = that.getInternalMessageType()
    that._isStarted = true
    that.__startNodeWebServer(cg)
  },

  __startNodeWebServer: (cg) => {
    var that = __$p$
    that.log(logCord, 'start node web server')

    const taskID = __key + _.now()
    if ($bc_.pNative) {
      // 定义一个处理该任务的回调
      var cbName = $bc_._get_callback((obj) => {
        if (obj.type === TNMT.AddCallTaskQueueSuccess) {
          return $bc_.runTaskSample(TaskMethodWay.SendEvent, cbName, ['start', 'callback', obj.queueInfo.id])
        } else if (obj.type === TNMT.CallTaskStart) {
          console.log('server start url: ', obj)
        }
      }, true)

      var serverURL = $bc_.App.getAppDataHomeDir() + '/server/www'
      // 优先使用系统DataHome目录下面的服务器引擎文件
      serverURL = $bc_.App.checkPathIsExist(serverURL) ? serverURL : $bc_.App.getAppResourceDir() + '/public/server/www'
      serverURL = $bc_.App.checkPathIsExist(serverURL) ? serverURL : $bc_.App.getAppResourceDir() + '/public/www'
      serverURL = $bc_.App.checkPathIsExist(serverURL) ? serverURL : $bc_.App.getAppResourceDir() + '/www'

      // 检测是否使用了www.js 作为
      serverURL = $bc_.App.checkPathIsExist(serverURL) ? serverURL : $bc_.App.getAppDataHomeDir() + '/server/www.js'
      serverURL = $bc_.App.checkPathIsExist(serverURL) ? serverURL : $bc_.App.getAppResourceDir() + '/public/server/www.js'
      serverURL = $bc_.App.checkPathIsExist(serverURL) ? serverURL : $bc_.App.getAppResourceDir() + '/public/www.js'
      serverURL = $bc_.App.checkPathIsExist(serverURL) ? serverURL : $bc_.App.getAppResourceDir() + '/www.js'

      if ($bc_.App.checkPathIsExist(serverURL) === false) {
        console.error(logCord, 'not found www file')
        return
      }

      return $bc_.runTaskSample(TaskMethodWay.Task, cbName, [taskID, [{
        appPath: $bc_.App.getAppPluginDir() + '/node',
        command: [
          serverURL,
          cg.port.toString()
        ],
        mainThread: false
      }]])
    } else {
      console.warn(logCord, 'please run you or remote python server for process')
    }
  }
}

var ProxyServerPluginWebServerNode = SelfClass.extend(__$p$)

//
// -----------------------------------------------
export {
  ProxyServerPluginWebServerNode
}
