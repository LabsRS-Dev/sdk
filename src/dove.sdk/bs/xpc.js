import { common } from './common'

var $bc_ = common

/**
* XPC 内容封装
* @type {{install: Function, unInstall: Function, find: Function, resume: Function, suspend: Function, invalidate: Function, sendMessage: Function}}
*/
$bc_.XPC = {
  /**
  * 安装新的XPC关联
  * @param jsonObj
  * @returns {*}
  */
  install: function (jsonObj = {}) {
    if ($bc_.pN) {
      try {
        var params = {
          key: jsonObj.xpc_key || 'default',
          id: jsonObj.bundleID || 'com.romanysoft.app.mac.xpc.AgentHelper'
        }

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        return $bc_.pN.app.registerNewXPCService(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }

    return false
  },

  /**
  * 解除XPC的关联
  * @param xpc_key
  * @returns {*}
  */
  unInstall: function (xpc_key) {
    if ($bc_.pN) {
      try {
        return $bc_.pN.app.unRegisterXPCService(xpc_key)
      } catch (e) {
        console.error(e)
      }
    }

    return false
  },

  /**
  * 查找XPC是否存在
  * @param xpc_key  xpc关联的Key的唯一标识
  * @returns {true/false}
  */
  find: function (xpc_key) {
    if ($bc_.pN) {
      try {
        return $bc_.pN.app.hasXPCService(xpc_key || 'default')
      } catch (e) {
        console.error(e)
      }
    }

    return false
  },

  /**
  * 恢复XPC服务
  * @param xpc_key
  */
  resume: function (xpc_key) {
    if ($bc_.pN) {
      try {
        $bc_.pN.app.resumeXPCService(xpc_key)
      } catch (e) {
        console.error(e)
      }
    }
  },

  /**
  * 挂起XPC服务
  * @param xpc_key
  */
  suspend: function (xpc_key) {
    if ($bc_.pN) {
      try {
        $bc_.pN.app.suspendXPCService(xpc_key)
      } catch (e) {
        console.error(e)
      }
    }
  },

  /**
  * 使XPC服务失效
  * @param xpc_key
  */
  invalidate: function (xpc_key) {
    if ($bc_.pN) {
      try {
        $bc_.pN.app.invalidateXPCService(xpc_key)
      } catch (e) {
        console.error(e)
      }
    }
  },

  /**
  * 向XPC发送消息
  * @param jsonObj 基础信息
  * @param cb 回调函数
  * @returns {*}
  */
  sendMessage: function (jsonObj, cb) {
    if ($bc_.pN) {
      try {
        var _json = jsonObj || {}
        var params = {
          xpc_key: _json.xpc_key || 'default',
          callback: _json.callback || $bc_._get_callback(function (obj) {
            console.log($.obj2string(obj))
            cb && cb(obj)
          }, true),
          messageDic: _json.messageDic
        }

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        return $bc_.pN.app.sendMessageToXPCService(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }
  }
}

/** *
* XPC Node Helper
* @type {{exec: Function}}
*/
$bc_.XPCNodeHelper = {
  /**
  * 获得默认的Node XPC Key
  * @returns {string}
  */
  getXPCKey: function () {
    return 'g_romanysoft_node_xpc'
  },

  /**
  * 获得NodeHelper的关键字
  * @returns {string}
  */
  getHelperBundleID: function () {
    return 'com.romanysoft.app.mac.xpc.NodeHelper'
  },

  /**
  * 执行Node命令
  * @param jsonObj
  * @param successCB 成功函数
  * @param failedCB  失败函数
  */
  exec: function (jsonObj, successCB, failedCB) {
    var $t = this

    var xpc_key = $t.getXPCKey()
    var helperID = $t.getHelperBundleID()

    var canExec = false

    // 备注，这种方式，暂时没有办法通过Sandbox
    alert('这是个弃用的方式,因为现在没有办法突破Sandbox')

    // 检查是否已经安装过
    if ($bc_.XPC.find(xpc_key) === false) {
      canExec = $bc_.XPC.install({
        xpc_key: xpc_key,
        bundleID: helperID
      })
    } else {
      canExec = true
    }

    // 根据是否可以执行来处理
    if (canExec) {
      var pluginDir = $bc_.App.getAppPluginDir()
      var node_path = pluginDir + '/node'

      var _json = jsonObj || {}

      // / 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          _json[key] = jsonObj[key]
        }
      }

      // 创建任务
      var messageDic = {
        'ms_type': 'CALL_TASK',
        'ms_obj': {
          'taskAppPath': node_path,
          'command': _json.command || ['-v'],
          'currentDirectoryPath': _json.currentDirectoryPath || '',
          'environmentDic': _json.environmentDic || {},
          'mainThread': _json.mainThread || false
        }
      }

      // 发送消息
      $bc_.XPC.sendMessage({
        'xpc_key': xpc_key,
        'messageDic': messageDic
      }, function (obj) {
        console.log('XPCNodeHelper log: ' + $.obj2string(obj))
        successCB && successCB(obj)
      })
    } else {
      console.error('XPCNodeHelper install failed.')
      failedCB && failedCB()
    }
  }
}

$bc_.XPCPythonHelper = {
  /**
  * 获得默认的Node XPC Key
  * @returns {string}
  */
  getXPCKey: function () {
    return 'g_romanysoft_python_xpc'
  },

  /**
  * 获得NodeHelper的关键字
  * @returns {string}
  */
  getHelperBundleID: function () {
    return 'com.romanysoft.app.mac.xpc.PythonHelper'
  },

  /**
  * 通用执行Python命令
  * @param jsonObj
  * @param successCB
  * @param failedCB
  */
  common_exec: function (jsonObj, successCB, failedCB) {
    var $t = this

    var xpc_key = $t.getXPCKey()
    var helperID = $t.getHelperBundleID()

    var canExec = false

    // 备注，这种方式，暂时没有办法通过Sandbox
    alert('这是个弃用的方式,因为现在没有办法突破Sandbox')

    // 检查是否已经安装过
    if ($bc_.XPC.find(xpc_key) === false) {
      canExec = $bc_.XPC.install({
        xpc_key: xpc_key,
        bundleID: helperID
      })
    } else {
      canExec = true
    }

    // 根据是否可以执行来处理
    if (canExec) {
      var pluginDir = $bc_.App.getAppPluginDir()
      var pythonCLI_path = pluginDir + '/pythonCLI'

      var _json = jsonObj || {}

      // 创建任务
      var messageDic = {
        'ms_type': 'CALL_TASK',
        'ms_obj': {
          'taskAppPath': pythonCLI_path,
          'command': _json.command || ['-v'],
          'currentDirectoryPath': _json.currentDirectoryPath || '',
          'environmentDic': _json.environmentDic || {},
          'mainThread': _json.mainThread !== false
        }
      }

      // 发送消息
      $bc_.XPC.sendMessage({
        'xpc_key': xpc_key,
        'messageDic': messageDic
      }, function (obj) {
        console.log('XPCNodeHelper log: ' + $.obj2string(obj))
        successCB && successCB(obj)
      })
    } else {
      console.error('XPCNodeHelper install failed.')
      failedCB && failedCB()
    }
  },

  _formatCommand: function (pythonCommand) {
    if (typeof pythonCommand !== 'string') {
      console.error('command must be string')
      alert('command must be string')
      return null
    }

    // 构造基本的命令
    var workDir = $bc_.App.getAppResourceDir() + '/data/python'
    var resourceDir = $bc_.App.getAppDataHomeDir()
    var configFile = 'Resources/config.plist'

    // 格式化
    var regCommand =
      '["-i","id.pythonCLI","-c","%config%","-r","%resourceDir%","-w","%workDir%","-m","%command%"]'
    var formatCommonStr = regCommand.replace(/%config%/g, configFile)
    formatCommonStr = formatCommonStr.replace(/%resourceDir%/g, resourceDir)
    formatCommonStr = formatCommonStr.replace(/%workDir%/g, workDir)
    formatCommonStr = formatCommonStr.replace(/%command%/g, pythonCommand)

    // 转换成标准的Command 数组
    var command = window.eval(formatCommonStr) // 转换成command

    return command
  },

  /**
  * 内置的执行方式
  * @param jsonObj
  * @param successCB
  * @param failedCB
  */
  exec: function (jsonObj, successCB, failedCB) {
    var $t = this
    var _json = jsonObj || {}

    var pythonCommand = _json.command || '' // {string}
    var command = $t._formatCommand(pythonCommand)

    // 传递参数
    var newJson = {
      command: command || ['-v'],
      currentDirectoryPath: _json.currentDirectoryPath || '',
      'environmentDic': _json.environmentDic || {},
      'mainThread': _json.mainThread !== false
    }

    $t.common_exec(newJson, successCB, failedCB)
  },

  /**
  * 启动Python假设的WebServer
  * @param jsonObj
  * @param successCB
  * @param failedCB
  */
  startWebServer: function (jsonObj, successCB, failedCB) {
    var $t = this

    var _json = jsonObj || {}

    // 传递参数
    var newJson = {
      'command': ' --port=' + $bc_.App.getServerPort(), // {要求string}
      'currentDirectoryPath': _json.currentDirectoryPath || '',
      'environmentDic': _json.environmentDic || {},
      'mainThread': _json.mainThread !== false
    }

    $t.exec(newJson, successCB, failedCB)
  }

}

// -----------------------------------------------
const xpc = $bc_
export {
  xpc
}
