import { common } from './common'

var $bc_ = common
/**
 * 窗体的设置
 * @type {{minimize: Function, maximize: Function, toggleFullScreen: Function, restore: Function, isMaximized: Function, move: Function, resize: Function, setMinSize: Function, setMaxSize: Function}}
 */
$bc_.Window = {

  // 最小化窗体
  minimize: function () {
    if ($bc_.pN) $bc_.pN.window.minimize()
  },

  // 最大化窗体
  maximize: function () {
    if ($bc_.pN) $bc_.pN.window.maximize()
  },

  // 全屏切换
  toggleFullScreen: function () {
    if ($bc_.pN) $bc_.pN.window.toggleFullscreen()
  },

  // 窗体状态恢复
  restore: function () {
    if ($bc_.pN) $bc_.pN.window.restore()
  },

  // 是否最大化
  isMaximized: function () {
    if ($bc_.pN) {
      return $bc_.pN.window.isMaximized()
    }

    return false
  },

  // 获取原点坐标
  getOrigin: function () {
    if ($bc_.pN) {
      return JSON.parse($bc_.pN.window.getOrigin())
    }
    return {
      x: 0,
      y: 0
    }
  },

  // 移动窗体
  move: function (jsonObj) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        // 限制内部属性：
        params['x'] = jsonObj['x'] || 0.0
        params['y'] = jsonObj['y'] || 0.0

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        $bc_.pN.window.move(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    } else {
      alert('启动窗体移动!')
    }
  },

  // 改变窗体大小
  resize: function (jsonObj) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        // 限制内部属性：
        params['width'] = jsonObj['width'] || 600
        params['height'] = jsonObj['height'] || 400

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        $bc_.pN.window.resize(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    } else {
      alert('启动窗体重置大小!')
    }
  },

  // 获取窗体尺寸最小值
  getMinSize: function () {
    if ($bc_.pN) {
      return JSON.parse($bc_.pN.window.getMinSize())
    }
    return {
      width: 600,
      height: 400
    }
  },

  // 设置窗体尺寸最小值
  setMinSize: function (jsonObj) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        // 限制内部属性：
        params['width'] = jsonObj['width'] || 600
        params['height'] = jsonObj['height'] || 400

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        $bc_.pN.window.setMinsize(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    } else {
      alert('启动窗体设置最小尺寸!')
    }
  },

  // 获取窗体最大值
  getMaxSize: function () {
    if ($bc_.pN) {
      return JSON.parse($bc_.pN.window.getMaxSize())
    }
    return {
      width: 600,
      height: 400
    }
  },

  // 设置窗体最大值
  setMaxSize: function (jsonObj) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        // 限制内部属性：
        params['width'] = jsonObj['width'] || 600
        params['height'] = jsonObj['height'] || 400

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        $bc_.pN.window.setMaxsize(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    } else {
      alert('启动窗体设置最大尺寸!')
    }
  },

  // 获取窗体当前尺寸
  getSize: function () {
    if ($bc_.pN) {
      return JSON.parse($bc_.pN.window.getSize())
    }

    return {
      width: 600,
      height: 400
    }
  },

  // 设置窗体当前尺寸
  setSize: function (jsonObj) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        // 限制内部属性：
        params['width'] = jsonObj['width'] || 600
        params['height'] = jsonObj['height'] || 400

        // / 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        $bc_.Window.resize(params)
      } catch (e) {
        console.error(e)
      }
    } else {
      alert('启动窗体设置最大尺寸!')
    }
  }

}

// -----------------------------------------------
const window = $bc_
export {
  window
}
