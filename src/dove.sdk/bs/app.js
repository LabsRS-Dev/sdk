import { common } from './common'

var $bc_ = common
/**
 * App 内容封装
 */
$bc_.App = {
  // 获得App的名称
  appName: null,
  getAppName: function () {
    if ($bc_.pN) {
      var t = this
      if (t.appName) return t.appName
      t.appName = $bc_.pN.app.getAppName()
      return t.appName
    }
    return 'AppName'
  },

  // 获得产品的版本
  appVersion: null,
  getAppVersion: function () {
    if ($bc_.pN) {
      var t = this
      if (t.appVersion) return t.appVersion
      t.appVersion = $bc_.pN.app.getAppVersion()
      return t.appVersion
    }
    return '4.5.6'
  },

  // 获得产品的构建包的版本
  appBuildVersion: null,
  getAppBuildVersion: function () {
    if ($bc_.pN) {
      var t = this
      if (t.appBuildVersion) return t.appBuildVersion
      t.appBuildVersion = $bc_.pN.app.getAppBuildVersion()
      return t.appBuildVersion
    }
    return '201506271454'
  },

  // 获得产品的ID
  appId: null,
  getAppId: function () {
    if ($bc_.pN) {
      var t = this
      if (t.appId) return t.appId
      t.appId = $bc_.pN.app.getAppIdentifier()
      return t.appId
    }
    return 'AppID'
  },

  // 获取启动的时候进程附带的参数
  getAppArgv: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.getAppArgv()
    }

    return []
  },

  // 获得产品的运行的操作系统及平台
  sysOS: null,
  getAppRunOnOS: function () {
    if ($bc_.pN && !$bc_.pIsUseMacCocoEngine) {
      var t = this
      if (t.sysOS) return t.sysOS
      t.sysOS = $bc_.pN.app.getAppRunOnOS()
      return t.sysOS
    }
    return 'MacOSX' // 原生返回MacOSX，其他的参照Electron
  },

  // 获得App是否在沙盒内
  getSandboxEnable: function () {
    if ($bc_.pN) {
      var sandboxEnable = $bc_.pN.app.getSandboxEnable()
      return sandboxEnable
    }
    return false
  },

  // 获取App是否已经注册
  getIsRegistered: function () {
    var t$ = this
    if ($bc_.pN) {
      if (t$.getSandboxEnable()) return true
      return $bc_.pN.app.getIsRegistered()
    }
    return false
  },

  // 获取App内部注册信息
  getRegInfoJSONString: function () {
    if ($bc_.pN) {
      var str = $bc_.pN.app.getRegInfoJSONString()
      return str
    }
    return ''
  },

  // 获取App认证的内部序列号信息
  getSerialNumber: function () {
    try {
      if ($bc_.pN) {
        var str = $bc_.pN.app.getStringSerialNumber()
        return str
      }
    } catch (e) {
      console.error(e)
    }

    return ''
  },

  // 获取本地IP地址
  getLocalIP: function () {
    if ($bc_.pN) {
      var str = $bc_.pN.app.getLocalIP()
      return str
    }
    return ''
  },

  // 终止运行，退出系统
  terminate: function () {
    if ($bc_.pN) {
      $bc_.pN.app.terminate()
    }
  },

  // 重启启动，先退出，然后重新启动
  relaunch: function () {
    if ($bc_.pN) {
      $bc_.pN.app.relaunch()
    }
  },

  // 激活自己
  activate: function () {
    if ($bc_.pN) {
      $bc_.pN.app.activate()
    }
  },

  // 隐藏自己
  hide: function () {
    if ($bc_.pN) {
      $bc_.pN.app.hide()
    }
  },

  // 取消隐藏自己
  unhide: function () {
    if ($bc_.pN) {
      $bc_.pN.app.unhide()
    }
  },

  // 发出beep声音
  beep: function () {
    if ($bc_.pN) {
      $bc_.pN.app.beep()
    }
  },

  // 激活Bounce事件
  bounce: function () {
    if ($bc_.pN) {
      $bc_.pN.app.bounce()
    }
  },

  // 打开链接地址
  open: function (data) {
    if ($bc_.pN) {
      return $bc_.pN.app.open(data || 'http://www.baidu.com')
    } else {
      try {
        window.open(data)
      } catch (e) {}
    }
  },

  // 打开文件，使用系统默认行为
  openFileWithDefaultApp: function (filePath) {
    if ($bc_.pN) {
      var _path = filePath || ($bc_.pN.path.tempDir() + 'tmp.txt')
      $bc_.pN.app.openFile(_path)
    }
  },

  // 通过应用程序的名称，启动应用程序
  launchApplication: function (applicationName) {
    if ($bc_.pN) {
      $bc_.pN.app.launch(applicationName || 'Safari') // Safari.app
    }
  },

  // 发送电子邮件
  sendEmail: function (jsonObj) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        // 限制内部属性：
        params['sendAddress'] = jsonObj['sendAddress'] || 'admin@gmail.com'
        params['toAddress'] = jsonObj['toAddress'] || 'admin@gmail.com'
        params['subject'] = jsonObj['subject'] || 'Hello'
        params['body'] = jsonObj['body'] || 'Hello!!'

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        $bc_.pN.app.sendEmailWithMail(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    } else {
      alert('启动发送邮件')
    }
  },

  // {开启启动部分}
  // 是否开启自动启动{苹果商店App 无效}
  isStartAtLogin: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.isStartAtLogin()
    }

    return false
  },

  // 开启自动启动功能{苹果商店App 无效}
  setStartAtLogin: function (enable) {
    if ($bc_.pN) {
      return $bc_.pN.app.setStartAtLogin(enable) // 备注：沙盒状态下无效
    }
  },

  // {NSUserDefaults}
  // 存储信息{key: value: }方式,Map方式
  setInfoToUserDefaults: function (jsonObj) {
    if ($bc_.pN) {
      var obj = jsonObj || {
        callback: 'console.log',
        key: '',
        value: ''
      }

      // 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          obj[key] = jsonObj[key]
        }
      }

      $bc_.pN.window.setInfoToUserDefaults(JSON.stringify(obj))
    }
  },
  // 获取存储信息{key: value: }方式,Map方式
  getInfoFromUserDefaults: function (jsonObj) {
    if ($bc_.pN) {
      var obj = jsonObj || {
        callback: 'console.log',
        key: ''
      }

      // 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          obj[key] = jsonObj[key]
        }
      }

      $bc_.pN.window.getInfoFromUserDefaults(JSON.stringify(obj))
    }
  },
  // 移除存储信息{key: value: }方式,Map方式
  removeItemFromUserDefaults: function (jsonObj) {
    if ($bc_.pN) {
      var obj = jsonObj || {
        callback: 'console.log',
        key: ''
      }
      // 统一向后兼容处理
      for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
          obj[key] = jsonObj[key]
        }
      }

      $bc_.pN.window.removeItemFromUserDefaults(JSON.stringify(obj))
    }
  },

  // {方便函数，设置评价App功能是否开启}
  setOptions_RateAppClose: function (enable) {
    $bc_.App.setInfoToUserDefaults({
      key: 'RateApp_CLOSE',
      value: enable
    })
  },

  // {获取开通的服务器端口}
  getServerPort: function () {
    var default_port = 8888
    if ($bc_.pN) {
      return $bc_.pN.app.getHttpServerPort() || default_port
    }

    return default_port
  },

  // 获得App的插件目录
  getAppPluginDir: $bc_.getAppPluginDir = function () {
    if ($bc_.pN) {
      return $bc_.pN.path.appPluginDirPath()
    }
    return ''
  },

  // 获得Application的Resource目录
  getAppResourceDir: $bc_.getAppResourceDir = function () {
    if ($bc_.pN) {
      return $bc_.pN.path.resource()
    }
    return ''
  },

  // 获得Public目录
  getAppResourcePublicDir: $bc_.getAppResourcePublicDir = function () {
    if ($bc_.pN) {
      return $bc_.pN.path.resource() + '/public'
    }
    return ''
  },

  // 获得App的包的目录
  getAppBundlePath: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.application()
    }
    return ''
  },

  // 获得AppDataHomeDir
  getAppDataHomeDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.appDataHomeDir()
    }
    return ''
  },

  // 获得Home Directory
  getHomeDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.homeDir()
    }
    return ''
  },

  // 获得DocumentsDir
  getDocumentsDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.documentsDir()
    }
    return ''
  },

  // 获得本地Documents目录
  getLocalDocumentsDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.localDocumentsDir()
    }
    return ''
  },

  // 获得LibraryDir
  getLibraryDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.libraryDir()
    }
    return ''
  },

  // 获得临时目录
  getTempDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.tempDir()
    }
    return ''
  },

  // 获得Cache目录
  getCacheDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.cacheDir()
    }
    return ''
  },

  // 获得Application目录
  getApplicationDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.applicationDir()
    }
    return ''
  },

  // 获得DesktopDir，桌面路径
  getDesktopDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.desktopDir()
    }
    return ''
  },

  // 获得downloadDir，下载目录路径
  getDownloadDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.downloadDir()
    }
    return ''
  },

  // 获得本地download目录路径
  getLocalDownloadDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.localDownloadDir()
    }
    return ''
  },

  // 获得本地desktop目录路径
  getLocalDesktopDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.localDesktopDir()
    }
    return ''
  },

  // 获得本地Library目录路径
  getLocalLibraryDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.localLibraryDir()
    }
    return ''
  },

  // 获得Movies目录路径
  getMoviesDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.moviesDir()
    }
    return ''
  },

  // 获得本地Movies目录路径
  getLocalMoviesDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.localMoviesDir()
    }
    return ''
  },

  // 获得Music目录
  getMusicDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.musicDir()
    }
    return ''
  },

  // 获得本地Music目录
  getLocalMusicDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.localMusicDir()
    }
    return ''
  },

  // 获得Pictures目录
  getPicturesDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.picturesDir()
    }
    return ''
  },

  // 获得本地Pictures目录
  getLocalPicturesDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.localPicturesDir()
    }
    return ''
  },

  // 获得UserName
  getUserName: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.userName()
    }
    return ''
  },

  // 获得User全名(UserFullName)
  getUserFullName: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.userFullName()
    }
    return ''
  },

  // 获得沙盒状态下可写入的Documents路径
  getWritableDocumentsDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.appWriteableDocumentDir()
    }
    return ''
  },
  // 获得沙盒状态下可写入的Download路径
  getWritableDownloadDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.appWriteableDownloadDir()
    }
    return ''
  },
  // 获得沙盒状态下可写入的Music路径
  getWritableMusicDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.appWriteableMusicDir()
    }
    return ''
  },
  // 获得沙盒状态下可写入的Movies路径
  getWritableMoviesDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.appWriteableMoviesDir()
    }
    return ''
  },
  // 获得沙盒状态下可写入的Pictures路径
  getWritablePicturesDir: function () {
    if ($bc_.pN) {
      return $bc_.pN.path.appWriteablePicturesDir()
    }
    return ''
  },

  // 检测路径是否存在
  checkPathIsExist: $bc_.pathIsExist = function (path) {
    if (path.trim() === '') return false

    if ($bc_.pN) {
      var _path = path || $bc_.pN.path.tempDir()
      return $bc_.pN.path.pathIsExist(_path)
    }

    return true
  },

  // 文件是否为0Byte
  checkFileIsZero: $bc_.checkFileIsZeroSize = function (file_path) {
    if (file_path.trim() === '') return false

    if ($bc_.pN) {
      var _path = file_path || $bc_.pN.path.tempDir()
      return $bc_.pN.path.fileIsZeroSize(_path)
    }

    return false
  },

  // 路径是否可以写
  checkPathIsWritable: $bc_.checkPathIsWritable = function (path) {
    if (path.trim() === '') return false

    if ($bc_.pN) {
      var _path = path || $bc_.pN.path.tempDir()
      return $bc_.pN.path.checkPathIsWritable(_path)
    }

    return true
  },

  // 创建空文件
  createEmptyFile: $bc_.createEmptyFile = function (file_path, cb) {
    if ($bc_.pN) {
      var _path = file_path || ($bc_.pN.path.tempDir() + 'tmp.txt')
      return $bc_.pN.window.createEmptyFile(JSON.stringify({
        path: _path,
        callback: $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
      }))
    }
  },

  // 创建目录
  createDir: $bc_.createDir = function (dir_path, atts, cb) {
    if ($bc_.pN) {
      try {
        var params = {}
        // 限制内部属性：
        params['callback'] = params['callback'] || $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
        params['path'] = dir_path || ($bc_.pN.path.tempDir() + 'tmp_dir001')
        if (atts) params['atts'] = atts || {}

        $bc_.pN.window.createDir(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }
  },

  // 删除文件
  removeFile: $bc_.removeFile = function (file_path, cb) {
    if ($bc_.pN) {
      var _path = file_path || ($bc_.pN.path.tempDir() + 'tmp.txt')
      return $bc_.pN.window.removeFile(JSON.stringify({
        path: _path,
        callback: $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
      }))
    }
  },

  // 删除目录
  removeDir: $bc_.removeDir = function (dir_path, cb) {
    if ($bc_.pN) {
      try {
        var params = {}
        // 限制内部属性：
        params['callback'] = params['callback'] || $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
        params['path'] = dir_path || ($bc_.pN.path.tempDir() + '/tmp_dir001')

        $bc_.pN.window.removeDir(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }
  },

  // 拷贝文件
  copyFile: $bc_.copyFile = function (jsonObj, cb) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        // 限制内部属性：
        params['callback'] = jsonObj['callback'] || $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
        params['src'] = jsonObj['src'] || ''
        params['dest'] = jsonObj['dest'] || ''

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        $bc_.pN.window.copyFile(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }
  },

  // 拷贝目录
  copyDir: $bc_.copyDir = function (jsonObj, cb) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        // 限制内部属性：
        params['callback'] = jsonObj['callback'] || $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
        params['src'] = jsonObj['src'] || ''
        params['dest'] = jsonObj['dest'] || ''

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        $bc_.pN.window.copyDir(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }
  },

  // 移动文件
  moveFile: $bc_.moveFile = function (jsonObj, cb) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        // 限制内部属性：
        params['callback'] = jsonObj['callback'] || $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
        params['src'] = jsonObj['src'] || ''
        params['dest'] = jsonObj['dest'] || ''

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        $bc_.pN.window.moveFile(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }
  },

  // 移动目录
  moveDir: $bc_.moveDir = function (jsonObj, cb) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        // 限制内部属性：
        params['callback'] = jsonObj['callback'] || $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
        params['src'] = jsonObj['src'] || ''
        params['dest'] = jsonObj['dest'] || ''

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        $bc_.pN.window.moveDir(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }
  },

  // 查找文件是否在此目录中存在
  findFile: $bc_.findFile = function (dir, fileName, cbName, cb) {
    if ($bc_.pN) {
      var _dir = dir || $bc_.pN.path.tempDir()
      var _fileName = fileName || 'tmp.txt'

      var params = {
        callback: cbName || $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true),
        dir: _dir,
        fileName: _fileName
      }

      return $bc_.pN.window.findFile(JSON.stringify(params))
    }

    return null
  },

  // 判断路径是否可读
  checkPathIsReadable: function (path) {
    if ($bc_.pN) {
      var _path = path || $bc_.pN.path.tempDir()
      return $bc_.pN.path.checkPathIsReadable(_path)
    }

    return false
  },

  // 判断路径是否可运行
  checkPathIsExecutable: function (path) {
    if ($bc_.pN) {
      var _path = path || $bc_.pN.path.tempDir()
      return $bc_.pN.path.checkPathIsExecutable(_path)
    }

    return false
  },

  // 判断路径是否可删除
  checkPathIsDeletable: function (path) {
    if ($bc_.pN) {
      var _path = path || $bc_.pN.path.tempDir()
      return $bc_.pN.path.checkPathIsDeletable(_path)
    }

    return false
  },

  // 判断是否为文件
  checkPathIsFile: function (path) {
    if ($bc_.pN) {
      var _path = path || $bc_.pN.path.tempDir()
      return $bc_.pN.path.checkPathIsFile(_path)
    }

    return false
  },

  // 判断是否为目录
  checkPathIsDir: function (path) {
    if ($bc_.pN) {
      var _path = path || $bc_.pN.path.tempDir()
      return $bc_.pN.path.checkPathIsDir(_path)
    }

    return false
  },

  getFileName: function (path) {
    if ($bc_.pN) {
      var _path = path || ($bc_.pN.path.tempDir() + 'tmp.txt')
      return $bc_.pN.path.getFileName(_path)
    }

    return ''
  },

  // 获取文件扩展名
  getFileExt: function (path) {
    if ($bc_.pN) {
      var _path = path || ($bc_.pN.path.tempDir() + 'tmp.txt')
      return $bc_.pN.path.getFileExt(_path)
    }

    return ''
  },

  // 获取文件名称，不带扩展名
  getFileNameWithoutExt: function (path) {
    if ($bc_.pN) {
      var _path = path || ($bc_.pN.path.tempDir() + 'tmp.txt')
      return $bc_.pN.path.getFileNameWithoutExt(_path)
    }

    return ''
  },

  // 获取路径上一级目录路径
  getPathParentPath: function (path) {
    if ($bc_.pN) {
      var _path = path || $bc_.pN.path.tempDir()
      return $bc_.pN.path.getPathParentPath(_path)
    }

    return ''
  },

  // 获取文件的基本属性
  getFilePropertyJSONString: function (path) {
    if ($bc_.pN) {
      var _path = path || ($bc_.pN.path.tempDir() + 'tmp.txt')
      return $bc_.pN.path.getFilePropertyJSONString(_path)
    }

    return ''
  },

  // 获取文件或目录的系统图标路径，返回的是png方式
  getFileOrDirIconPath: function (path) {
    if ($bc_.pN) {
      var _path = path || ($bc_.pN.path.tempDir() + 'tmp.txt')
      return $bc_.pN.path.getFileOrDirIconPath(_path)
    }

    return ''
  },

  // 获取临时文件的路径
  getNewTempFilePath: function (fileName) {
    if ($bc_.pN) {
      return $bc_.pN.path.getNewTempFilePath(fileName || 'rs.txt') // fileName 文件名称
    }

    return ''
  },

  // 获取其他App的基本信息
  /**
   *
   * @param path 路径
   * @param cb   回调函数
   * 返回的值的样例：
   *
   */
  getOtherAppInfo: function (path, cb) {
    if ($bc_.pN) {
      try {
        var params = {}
        // 限制内部属性：
        params['callback'] = params['callback'] || $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
        params['path'] = path || ($bc_.pN.path.tempDir() + '/tmp_dir001')

        return $bc_.pN.window.getOtherAppInfo(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }

    return ''
  },

  /**
   * 获取格式化后的字符串。主要是用动态变量来处理
   * 支持如下变量：
   * ${HOME}
   * ${BUNDLE}
   * ${BUNDEL_RESOURCE}
   * ${BUNDEL_PLUGIN}
   * ${DOCUMENTS}
   * ${LIBRARY}
   * ${TEMP}
   * ${CACHE}
   * ${APPLICATION}
   * ${DESKTOP}
   * ${DOWNLOAD}
   * ${MOVIES}
   * ${MUSIC}
   * ${PICTURES}
   * ${APPW_DOCUMENTS}
   * ${APPW_DOWNLOAD}
   * ${APPW_MOVIES}
   * ${APPW_MUSIC}
   * ${APPW_PICTURES}
   * ${LOCAL_DESKTOP}
   * ${LOCAL_DOWNLOAD}
   * ${LOCAL_MOVIES}
   * ${LOCAL_MUSIC}
   * ${LOCAL_PICTURES}
   * ${LOCAL_LIBRARY}
   * ${LOCAL_DOCUMENTS}
   * ${USER_NAME}
   * ${USER_FULL_NAME}
   * ${APPDATA_HOME}
   * ${APP_UI_DIR}
   * ${APP_NAME}
   * ${APP_VERSION}
   * ${APP_BUILD_VERSION}
   * ${APP_ID}
   * @param str
   * @returns {*}
   */
  getUpdateEnvString: function (str) {
    if ($bc_.pN) {
      try {
        return $bc_.pN.path.getUpdateEnvString(str)
      } catch (e) {
        console.error(e)
      }
    }

    return ''
  },

  // 获得文件/目录size(实际字节数 1024)
  fileSizeAtPath: function (path) {
    if ($bc_.pN) {
      var _path = path || ($bc_.pN.path.tempDir() + 'tmp.txt')
      return $bc_.pN.app.fileSizeAtPath(_path)
    }

    return ''
  },

  // 获得文件/目录占用磁盘(字节数 1000)
  diskSizeAtPath: function (path) {
    if ($bc_.pN) {
      var _path = path || ($bc_.pN.path.tempDir() + 'tmp.txt')
      return $bc_.pN.app.diskSizeAtPath(_path)
    }

    return ''
  },

  // 获得文件/目录转译的容量(以1000基数，还是1024基数。 )
  getFileSizeString: function (bytes = 0, si = true) {
    if ($bc_.pN) {
      return (si ? $bc_.pN.app.getFileSizeString1000(bytes) : $bc_.pN.app.getFileSizeString1024(bytes))
    }

    return ''
  },

  // 获得字符串的md5值
  md5Digest: function (str) {
    if ($bc_.pN) {
      return $bc_.pN.app.md5Digest(str || 'testMd5')
    }

    return ''
  },

  // {扩展}
  getBuyURL: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.getBuyURL()
    }
    return ''
  },

  getFAQURL: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.getFAQURL()
    }
    return ''
  },

  getHomePageURL: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.getHomePageURL()
    }
    return ''
  },

  getDocumentPageURL: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.getDocumentPageURL()
    }
    return ''
  },

  getRoadmapPageURL: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.getRoadmapPageURL()
    }
    return ''
  },

  getReportIssuePageURL: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.getReportIssuePageURL()
    }
    return ''
  },

  getViewLicensePageURL: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.getViewLicensePageURL()
    }
    return ''
  },

  getReleaseNotesPageURL: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.getReleaseNotesPageURL()
    }
    return ''
  },

  getCheckForUpdatePageURL: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.getCheckForUpdatePageURL()
    }
    return ''
  },

  // 获得当前苹果操作系统本地的语言
  getAppleLanguage: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.curAppleLanguage()
    }

    return 'en-US'
  },

  // 获取兼容Google翻译的语言标识信息
  getCompatibleGoogleLanguageInfo: function () {
    var info = {
      'auto': {
        'af': 'Spoor taal',
        'sq': 'Zbulo gjuhën',
        'ar': 'الكشف عن اللغة',
        'hy': 'Հայտնաբերել լեզուն',
        'az': 'Dil aşkar',
        'eu': 'Hizkuntza atzeman',
        'be': 'Вызначыць мову',
        'bn': 'ভাষা সনাক্ত করুন',
        'bs': 'Detect jeziku',
        'bg': 'Разпознаване на езика',
        'ca': 'Detectar idioma',
        'ceb': 'Makamatikod pinulongan',
        'ny': 'azindikire chinenero',
        'zh-CN': '检测语言',
        'zh-TW': '檢測語言',
        'hr': 'Otkrij jezik',
        'cs': 'Rozpoznat jazyk',
        'da': 'Registrer sprog',
        'nl': 'Detect taal',
        'en': 'Detect language',
        'eo': 'Detekti lingvo',
        'et': 'Tuvasta keel',
        'tl': 'Alamin ang wika',
        'fi': 'Tunnista kieli',
        'fr': 'Détecter la langue',
        'gl': 'Detectar idioma',
        'ka': 'ენის განსაზღვრა',
        'de': 'Sprache erkennen',
        'el': 'Εντοπισμός γλώσσας',
        'gu': 'ભાષા શોધો',
        'ht': 'Detekte lang',
        'ha': 'Gano harshen',
        'iw': 'אתר שפה',
        'hi': 'भाषा का पता लगाने',
        'hmn': 'Ntes lus',
        'hu': 'Nyelv felismerése',
        'is': 'Greina tungumál',
        'ig': 'Ịchọpụta asụsụ',
        'id': 'Deteksi bahasa',
        'ga': 'Braith teanga',
        'it': 'Rileva lingua',
        'ja': '言語を検出',
        'jw': 'Ndeteksi basa',
        'kn': 'ಭಾಷೆಯನ್ನು ಪತ್ತೆಮಾಡಿ',
        'kk': 'тілін анықтау',
        'km': 'រក​ឃើញ​ភាសា',
        'ko': '언어 감지',
        'lo': 'ພາ​ສາ​ການ​ກວດ​ສອບ',
        'la': 'Deprehendere linguae',
        'lv': 'Noteikt valodu',
        'lt': 'Aptikti kalbą',
        'mk': 'Откривање на јазик',
        'ms': 'Kesan bahasa',
        'ml': 'ഭാഷ തിരിച്ചറിയുക',
        'mt': 'Jindunaw lingwa',
        'mi': 'Kitea te reo',
        'mr': 'भाषा शोधा',
        'mn': 'Хэл илрүүлэх',
        'my': 'ဘာသာစကား detect',
        'ne': 'भाषा पत्ता लगाउनुहोस्',
        'no': 'Detect språk',
        'fa': 'تشخیص زبان',
        'pl': 'Wykryj język',
        'pt': 'Detectar idioma',
        'pa': 'ਭਾਸ਼ਾ ਦੀ ਖੋਜਣਾ ਹੈ',
        'ma': 'ਭਾਸ਼ਾ ਖੋਜ',
        'ro': 'Detecta limbă',
        'ru': 'Определить язык',
        'sr': 'Откриј језик',
        'st': 'khona ho utloa puo',
        'si': 'භාෂාවක් අනාවරණය',
        'sk': 'Rozpoznať jazyk',
        'sl': 'Zaznaj jezik',
        'so': 'Ogaado luqadda',
        'es': 'Detectar idioma',
        'sw': 'Kuchunguza lugha',
        'sv': 'Identifiera språk',
        'tg': 'ошкор забон',
        'ta': 'மொழியைக் கண்டறி',
        'te': 'భాషను కనుగొను',
        'th': 'ตรวจหาภาษา',
        'tr': 'Dili algıla',
        'uk': 'Визначити мову',
        'ur': 'زبان کا پتہ لگانے',
        'uz': 'tilni aniqlash',
        'vi': 'Phát hiện ngôn ngữ',
        'cy': 'Canfod iaith',
        'yi': 'דעטעקט שפּראַך',
        'yo': 'Ri ede',
        'zu': 'Thola ulimi'
      },
      'local': {
        'af': 'Afrikaans',
        'sq': 'Shqiptar',
        'ar': 'العربية',
        'hy': 'Հայերեն',
        'az': 'Azərbaycan',
        'eu': 'Euskal',
        'be': 'Беларуская',
        'bn': 'বাঙ্গালী',
        'bs': 'Bosanski',
        'bg': 'Български',
        'ca': 'Català',
        'ceb': 'Cebuano',
        'ny': 'Chichewa',
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文',
        'hr': 'Hrvatski',
        'cs': 'Čeština',
        'da': 'Dansk',
        'nl': 'Nederlands',
        'en': 'English',
        'eo': 'Esperanto',
        'et': 'Eesti',
        'tl': 'Pilipino',
        'fi': 'Suomi',
        'fr': 'Français',
        'gl': 'Galega',
        'ka': 'ქართული',
        'de': 'Deutsch',
        'el': 'Ελληνικά',
        'gu': 'ગુજરાતી',
        'ht': 'Kreyòl ayisyen',
        'ha': 'Hausa',
        'iw': 'עברית',
        'hi': 'हिन्दी',
        'hmn': 'Hmoob',
        'hu': 'Magyar',
        'is': 'Icelandic',
        'ig': 'Igbo',
        'id': 'Indonesia',
        'ga': 'Gaeilge',
        'it': 'Italiano',
        'ja': '日本の',
        'jw': 'Jawa',
        'kn': 'ಕನ್ನಡ',
        'kk': 'Қазақ',
        'km': 'ខ្មែរ',
        'ko': '한국의',
        'lo': 'ລາວ',
        'la': 'Latine',
        'lv': 'Latvijas',
        'lt': 'Lietuvos',
        'mk': 'Македонски',
        'ms': 'Melayu',
        'ml': 'മലയാളം',
        'mt': 'Malti',
        'mi': 'Maori',
        'mr': 'मराठी',
        'mn': 'Монгол',
        'my': 'မြန်မာ (ဗမာ)',
        'ne': 'नेपाली',
        'no': 'Norsk',
        'fa': 'فارسی',
        'pl': 'Polski',
        'pt': 'Português',
        'pa': 'ਪੰਜਾਬੀ ਦੇ',
        'ma': 'ਪੰਜਾਬੀ ਦੇ',
        'ro': 'Român',
        'ru': 'Русский',
        'sr': 'Српски',
        'st': 'Sesotho',
        'si': 'සිංහල',
        'sk': 'Slovenský',
        'sl': 'Slovenščina',
        'so': 'Somali',
        'es': 'Español',
        'sw': 'Kiswahili',
        'sv': 'Svenska',
        'tg': 'тоҷик',
        'ta': 'தமிழ்',
        'te': 'తెలుగు',
        'th': 'ไทย',
        'tr': 'Türk',
        'uk': 'Український',
        'ur': 'اردو',
        'uz': "O'zbekiston",
        'vi': 'Tiếng Việt',
        'cy': 'Cymraeg',
        'yi': 'ייִדיש',
        'yo': 'Yoruba',
        'zu': 'Zulu'
      }
    }

    return info
  },

  // 获得兼容浏览器的语言标识, 发起者，为Native
  getCompatibleWebkitLanguageList: function (_getType) {
    var getType = _getType || 'Native2Webkit' // 获取类型，默认是获取兼容WebKit的语言标识数组

    var defaultLanguage = 'en'
    // 本地对应浏览器的语言标识
    var NativeApple2WebKitLanguageMap = {
      'Unknown': [''],
      'en': ['en', 'en-US', 'en-us'], // 英语

      'fr': ['fr', 'fr-FR', 'fr-fr'], // French (fr) 法语

      'de': ['de', 'de-DE', 'de-de'], // German (de) 德语

      'zh-Hans': ['zh', 'zh-CN', 'zh-cn', 'zh-Hans'], // Chinese (Simplified) (zh-Hans) 中文简体

      'zh-Hant': ['zh-TW', 'zh-tw', 'zh-Hant'], // Chinese (Traditional) (zh-Hant) 中文繁体

      'ja': ['ja', 'ja-JP', 'ja-jp'], // Japanese (ja) 日语

      'es': ['es', 'es-ES', 'es-es'], // Spanish (es) 西班牙语

      'es-MX': ['es-MX', 'es-XL', 'es-xl'], // Spanish (Mexico) (es-MX) 西班牙语（墨西哥）

      'it': ['it', 'it-IT', 'it-it'], // Italian (it) 意大利语

      'nl': ['nl', 'nl-NL', 'nl-nl'], // Dutch (nl) 荷兰语

      'ko': ['ko', 'ko-KR', 'ko-kr'], // Korean (ko) 韩语

      'pt': ['pt', 'pt-BR', 'pt-br'], // Portuguese (pt) 葡萄牙语

      'pt-PT': ['pt-PT', 'pt-pt'], // Portuguese (Portugal) (pt) 葡萄牙语（葡萄牙）

      'da': ['da', 'da-DK', 'da-da'], // Danish (da) 丹麦语

      'fi': ['fi', 'fi-FI', 'fi-fi'], // Finnish (fi) 芬兰语

      'nb': ['nb', 'nb-NO', 'nb-no'], // Norwegian Bokmal (nb) 挪威语

      'sv': ['sv', 'sv-SE', 'sv-se'], // Swedish (sv) 瑞典语

      'ru': ['ru', 'ru-RU', 'ru-ru'], // Russian (ru) 俄语

      'pl': ['pl', 'pl-PL', 'pl-pl'], // Polish (pl) 波兰语

      'tr': ['tr', 'tr-TR', 'tr-tr'], // Turkish (tr) 土耳其语

      'ar': ['ar', 'AR'], // Arabic (ar) 阿拉伯语

      'th': ['th', 'th-TH', 'th-th'], // Thai (th) 泰语

      'cs': ['cs', 'cs-CZ', 'cs-cz'], // Czech (cs) 捷克语

      'hu': ['hu', 'hu-HU', 'hu-hu'], // Hungarian (hu) 匈牙利语

      'ca': ['ca', 'ca-ES', 'ca-es'], // Catalan (ca) 加泰罗尼亚语

      'hr': ['hr', 'hr-HR', 'hr-hr'], // Croatian (hr) 克罗地亚语

      'el': ['el', 'el-GR', 'el-gr'], // Greek (el) 希腊语

      'he': ['he', 'he-IL', 'he-il'], // Hebrew (he) 希伯来语

      'ro': ['ro', 'ro-RO', 'ro-ro'], // Romanian (ro) 罗马尼亚语

      'sk': ['sk', 'sk-SK', 'sk-sk'], // Slovak (sk) 斯洛伐克语

      'uk': ['uk', 'uk-UA', 'uk-ua'], // Ukrainian (uk) 乌克兰语

      'id': ['id', 'ID', 'id-ID', 'id-id'], // Indonesian (id) 印尼语

      'ms': ['ms', 'MS', 'ms-MS', 'ms-ms'], // Malay (ms) 马来西亚语

      'vi': ['vi', 'vi-VN', 'vi-vn'] // Vietnamese (vi) 越南语
    }

    if (getType === 'Native2Webkit') { // 先获取Native的语言，然后查找Map
      var appleLanguage = 'en-US'
      if ($bc_.pN) {
        appleLanguage = $bc_.pN.app.curAppleLanguage()
      }

      if (NativeApple2WebKitLanguageMap.hasOwnProperty(appleLanguage)) {
        return NativeApple2WebKitLanguageMap[appleLanguage]
      }

      return NativeApple2WebKitLanguageMap[defaultLanguage]
    } else if (getType === 'webkitCompatible') {
      var mapValue = null
      var webLanguage = navigator.language || 'en'

      var inArray = function (value, array) {
        if (Array.prototype.indexOf) {
          return array.indexOf(value)
        } else {
          for (var i = 0; i < array.length; i++) {
            if (array[i] === value) return i
          }
          return -1
        }
      }

      for (var key in NativeApple2WebKitLanguageMap) {
        if (NativeApple2WebKitLanguageMap.hasOwnProperty(key)) {
          var languageArray = NativeApple2WebKitLanguageMap[key]
          if (inArray(webLanguage, languageArray) > -1) {
            mapValue = languageArray
            break
          }
        }
      }

      return mapValue
    }

    return console.error('调用方式不正确，需要的参数为:Native2Webkit 或者webkitCompatible')
  },

  // 设置用户的语言
  setUserLanguage: function (language) {
    if ($bc_.pN) {
      return $bc_.pN.app.setUserLanguage(language || 'en-US')
    }
  },

  // 获取用户设置的语言
  getUserLanguage: function () {
    if ($bc_.pN) {
      return $bc_.pN.app.curUserLanguage()
    }

    return 'en-US'
  },

  // 截屏[整个屏幕]
  captureFull: function (jsonObj, cb) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        // 限制内部属性：
        params['callback'] = params['callback'] || $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
        params['filePath'] = params['filePath'] || ($bc_.pN.path.tempDir() +
          'cap_screen.png') // 保存文件

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }
        $bc_.pN.window.capture(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }
  },

  // 添加目录到变化监视器
  addDirPathToChangeWatcher: function (jsonObj, cb) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}

        params['callback'] = params['callback'] || $bc_._get_callback(function (obj) {
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileWritten"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileAttributesChanged"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileSizeIncreased"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"AccessWasRevoked"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"LinkCountChanged"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileRenamed"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileDeleted"} (app.js, line 270)
          cb && cb(obj)
        }, true)
        params['path'] = params['path'] || ($bc_.pN.path.tempDir())

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        $bc_.pN.window.createDirChangeWatcher(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }
  },

  // 添加文件目录到变化监视器
  addFilePathToChangeWatcher: function (jsonObj, cb) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}

        params['callback'] = params['callback'] || $bc_._get_callback(function (obj) {
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileWritten"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileAttributesChanged"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileSizeIncreased"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"AccessWasRevoked"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"LinkCountChanged"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileRenamed"} (app.js, line 270)
          // [Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileDeleted"} (app.js, line 270)
          cb && cb(obj)
        }, true)
        params['path'] = params['path'] || ($bc_.pN.path.tempDir())

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        $bc_.pN.window.createFileChangeWatcher(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }
  },

  // 从变化监视器中移除
  removeFromChangeWatcher: function (jsonObj) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        params['path'] = params['path'] || ($bc_.pN.path.tempDir())

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        return $bc_.pN.window.removeFromChangeWatcher(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }

    return false
  },

  // 打印 (一般情况下，不建议使用)
  print: function (jsonObj) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        params['silent'] = params['silent'] || false
        params['printBackground'] = params['printBackground'] || false

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        return $bc_.pN.window.print(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }
  },

  // 打印到PDF  (一般情况下，不建议使用)
  printToPDF: function (jsonObj, cb) {
    if ($bc_.pN) {
      try {
        var params = jsonObj || {}
        params['callback'] = params['callback'] || $bc_._get_callback(function (obj) {
          cb && cb(obj)
        }, true)
        params['marginsType'] = params['marginsType'] || 0
        params['pageSize'] = params['pageSize'] || 'A4'
        params['printBackground'] = params['printBackground'] || false
        params['printSelectionOnly'] = params['printSelectionOnly'] || false
        params['landscape'] = params['landscape'] || false
        params['filePath'] = params['filePath'] || ($bc_.pN.path.tempDir() + '/' + Date
          .now() + '.pdf')

        // 统一向后兼容处理
        for (var key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            params[key] = jsonObj[key]
          }
        }

        return $bc_.pN.window.printToPDF(JSON.stringify(params))
      } catch (e) {
        console.error(e)
      }
    }
  }

}

//
// -----------------------------------------------
const app = $bc_
export {
  app
}
