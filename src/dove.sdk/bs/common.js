import _ from 'lodash'

// Object functions
// -------------------------------------------------------------------------
var $bc_ = {}

$bc_.pN = $bc_.pNative = null // 调用底层接口
$bc_.pIsUseElectron = false // 是否使用了Electron引擎,默认是没有使用
$bc_.pIsUseMacCocoEngine = false // 是否使用了MacOSX本地引擎

// 定义临时回调处理函数定义接口

$bc_._get_callback = function (func, noDelete = true) {
  var _nativeCallback = {}
  try {
    window._nativeCallback = window._nativeCallback || {}
    _nativeCallback = window._nativeCallback
  } catch (error) {
    console.error(error)
  }

  var r = _.uniqueId('ncb' + _.now()) + _.uniqueId('n' + _.random(0, 99999))
  var rFnc = r + '_fnc'

  _nativeCallback[rFnc] = func
  _nativeCallback[r] = function () {
    try {
      if (!noDelete) {
        delete _nativeCallback[r]
        delete _nativeCallback[rFnc]
      }
    } catch (e) {
      console.error(e)
    }

    if (_.isFunction(func)) {
      func.apply(null, arguments)
    }
  }
  return '_nativeCallback.' + r
}

$bc_.cb_execTaskUpdateInfo = null // 执行任务的回调
$bc_.pCorePlugin = { // 核心处理引导插件部分,尽量不要修改
  useThread: true,
  passBack: 'BS.b$.cb_execTaskUpdateInfo',
  packageMode: 'bundle',
  taskToolPath: '/Plugins/extendLoader.bundle',
  bundleClassName: 'LibCommonInterface'
}

$bc_.pIAPPlugin = {
  path: '/plugin.iap.bundle'
}

// 自动匹配检测
var __auto = function (ref) {
  try {
    if ((typeof window.maccocojs !== 'undefined') && (typeof window.maccocojs === 'object') && window.maccocojs.hasOwnProperty('app')) {
      ref.pN = ref.pNative = window.maccocojs // 原MacOSX本地引擎
      ref.pIsUseMacCocoEngine = true
      ref.pIsUseElectron = false
    } else if ((typeof process === 'object') && (typeof require === 'function') && (process.hasOwnProperty('pid'))) {
      try {
        console.log('============= must first load =================')
        try {
          window['eletron_require'] = window.require
          window['eletron_module'] = window.module

          // Electron引擎加载方式，兼容新的及老的版本。支持：最新1.1.3和0.34版本系列
          try {
            ref.pN = ref.pNative = eval('require("remote").require("./romanysoft/maccocojs")')
          } catch (error) {
            try {
              ref.pN = ref.pNative = eval('require("electron").remote.require("./romanysoft/maccocojs")')
            } catch (error) {
              console.error(error)
            }
          }

          // 重新处理require,module的关系
          window.require = undefined
          // window.module.exports = undefined
          window.module = undefined
        } catch (error) {
          console.error(error)
        }
        ref.pIsUseElectron = true
        ref.pIsUseMacCocoEngine = false
        console.log('============= must first load [end]=================')
      } catch (error) {
        console.error(error)
      }
    }
  } catch (error) {
    console.error(error)
  }

  return ref
}

// Auto install base native Engine
$bc_ = __auto($bc_)

// Define some common function for old app
// 定位文件/目录
$bc_.cb_revealInFinder = null // 选择定位文件的回调
$bc_.revealInFinder = function (path, cb) {
  path = path || ''
  path = path.trim()
  if ($bc_.pN && path !== '') {
    try {
      $bc_.pN.window.revealInFinder(JSON.stringify({
        callback: $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, false),
        filePath: path
      }))
    } catch (e) {
      console.error(e)
    }
  } else if (!$bc_.pN) {
    alert('启动定位路径功能')
  }
}

// 预览文件
$bc_.previewFile = function (paramOptions, cb) {
  if ($bc_.pN) {
    try {
      var params = paramOptions || {}
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      params['filePath'] = paramOptions['filePath'] || ''

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key]
        }
      }

      $bc_.pN.window.previewFile(JSON.stringify(params))
    } catch (e) {
      console.error(e)
    }
  } else {
    alert('启动内置预览文件功能')
  }
}

// 检测是否支持本地存储
$bc_.check_supportHtml5Storage = function () {
  try {
    return 'localStorage' in window && window['localStorage'] != null
  } catch (e) {
    return false
  }
}

// 初始化默认的Manifest文件, callback 必须定义才有效
$bc_.defaultManifest_key = 'js_defaultManifest_key'
$bc_.defaultManifest = {}

// 保存默认Manifest对象
$bc_.saveDefaultManifest = function (newManifest) {
  if (!$bc_.check_supportHtml5Storage()) return false
  var obj = {
    manifest: newManifest || $bc_.defaultManifest
  }
  var encoded = JSON.stringify(obj)
  try {
    window.localStorage.setItem($bc_.defaultManifest_key, encoded)
  } catch (error) {
    console.error(error)
  }

  return true
}

// 还原默认Manifest对象
$bc_.revertDefaultManifest = function () {
  try {
    if (!$bc_.check_supportHtml5Storage()) return false
    var encoded = window.localStorage.getItem($bc_.defaultManifest_key)
    if (encoded != null) {
      var obj = JSON.parse(encoded)
      $bc_.defaultManifest = obj.manifest
    }
  } catch (error) {
    console.error(error)
  }

  return true
}

$bc_.getJQuery$ = function () {
  try {
    var $ = window.jQuery || window.$ || undefined
    console.assert(_.isObject($), 'Must be loaded jQuery library first \n')
    return $
  } catch (error) {
    console.error(error)
  }
}

//
// -----------------------------------------------
const common = $bc_
export {
  common
}
