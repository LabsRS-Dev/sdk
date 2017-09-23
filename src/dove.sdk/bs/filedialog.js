import { common } from './common'
import _ from 'lodash'

var $bc_ = common

// 导入文件
/**
 BS.$bc_.cb_importFiles({
 "success":true,
 "parentDir":"/Volumes/DiskShareUser/Users/ian/TestResource/xls",
 "filesCount":1,
 "filesArray":[
    {"isExecutable":true,
    "isDeletable":false,
    "fileNameWithoutExtension":"Book1",
    "fileName":"Book1.xls",
    "fileSize":7680,
    "fileSizeStr":"7.7KB",
    "fileUrl":"file:///Volumes/DiskShareUser/Users/ian/TestResource/xls/Book1.xls",
    "isReadable":true,
    "isWritable":true,
    "extension":"xls",
    "filePath":"/Volumes/DiskShareUser/Users/ian/TestResource/xls/Book1.xls"
    }
  ]
});
  **/
$bc_.cb_importFiles = null // 导入文件的回调
/**
 * 导入文件
 * @param params 参数的json对象
 * @param noNcb 非Native的状态下，执行的回调函数
 * @param cb    Native状态下，执行的回调函数是，默认是优化外部传入函数
 */
$bc_.importFiles = function (paramOptions, noNcb, cb) {
  var _this = this
  try {
    var params = {}
    // 限制内部属性：
    params['callback'] = paramOptions['callback'] || _this._get_callback(function (obj) {
      if (_this.cb_importFiles) {
        _this.cb_importFiles && _this.cb_importFiles(obj)
      } else {
        cb && cb(obj)
      }
    }, true)
    params['title'] = paramOptions['title'] || 'Select a file'
    params['prompt'] = paramOptions['prompt'] || 'Open'

    params['allowOtherFileTypes'] = paramOptions['allowOtherFileTypes'] || false
    params['allowMulSelection'] = paramOptions['allowMulSelection'] || false
    params['canCreateDir'] = paramOptions['canCreateDir'] || false
    params['canChooseFiles'] = true
    params['canChooseDir'] = false
    params['canAddToRecent'] = true // 是否添加到最近目录中
    params['calculateDirSize'] = !!paramOptions['calculateDirSize'] || false
    params['directory'] = paramOptions['directory'] || '' // 默认指定的目录
    params['types'] = paramOptions['types'] || [] // eg. ['png','svg'] 或 ['*']

    // 下拉文件类型选择处理
    params['enableFileFormatCombox'] = paramOptions['enableFileFormatCombox'] || false
    params['typesDescript'] = paramOptions['typesDescript'] || []
    params['lable'] = paramOptions['lable'] || 'File Format:'
    params['label'] = paramOptions['label'] || 'File Format:'
    // [end]下拉文件类型选择处理

    // / 统一向后兼容处理
    for (var key in paramOptions) {
      if (paramOptions.hasOwnProperty(key)) {
        params[key] = paramOptions[key]
      }
    }

    if ($bc_.pN) {
      $bc_.pN.window.openFile(JSON.stringify(params))
    } else {
      alert('启动选择文件对话框!')
      noNcb && noNcb()
    }
  } catch (e) {
    console.error(e)
  }
}

// 选择输出目录
/**
 * 选择目录传入的参数：
 * {
        callback: "BS.$bc_.cb_selectOutDir",
        allowOtherFileTypes: false,
        canCreateDir: true,
        canChooseDir: true,
        canChooseFiles: false, // 不可以选择文件
        title: "Select Directory",
        prompt: "Select",
        types: []              // 类型要为空
    }
  * @type {null}
  */
$bc_.cb_selectOutDir = null // 选择输出目录的回调
/**
 * 选择输出目录
 * @param params 传递的json对象
 * @param noNcb 非Native状态下，执行
 * @param cb 在Native下，可以通过传递cb来执行
 */
$bc_.selectDir = $bc_.selectOutDir = function (paramOptions, noNcb, cb) {
  try {
    var params = {}

    // 限制内部属性：
    params['callback'] = paramOptions['callback'] || $bc_._get_callback(function (obj) {
      if (_.isFunction($bc_.cb_selectOutDir)) {
        $bc_.cb_selectOutDir && $bc_.cb_selectOutDir(obj)
      } else {
        cb && cb(obj)
      }
    }, true)
    params['title'] = paramOptions['title'] || 'Select Directory'
    params['prompt'] = paramOptions['prompt'] || 'Select'

    params['allowOtherFileTypes'] = paramOptions['allowOtherFileTypes'] || false
    params['allowMulSelection'] = paramOptions['allowMulSelection'] || false
    params['canCreateDir'] = paramOptions['canCreateDir'] !== false
    params['canChooseDir'] = true
    params['canChooseFiles'] = false // 不可以选择文件
    params['canAddToRecent'] = true // 是否添加到最近目录中
    params['calculateDirSize'] = !!paramOptions['calculateDirSize'] || false
    params['directory'] = paramOptions['directory'] || '' // 默认指定的目录
    params['types'] = []

    // / 统一向后兼容处理
    for (var key in paramOptions) {
      if (paramOptions.hasOwnProperty(key)) {
        params[key] = paramOptions[key]
      }
    }

    if ($bc_.pN) {
      $bc_.pN.window.openFile(JSON.stringify(params))
    } else {
      alert('启动选择目录对话框!')
      noNcb && noNcb()
    }
  } catch (e) {
    console.error(e)
  }
}

// 选择输出文件
/*
  BS.$bc_.cb_selectOutFile({
  "success":true,
  "fileName":"untitled.csv",
  "fileUrl":"file:///Volumes/DiskShareUser/Users/ian/TestResource/xls/untitled.csv",
  "fileNameWithoutExtension":"untitled",
  "extension":"csv",
  "filePath":"/Volumes/DiskShareUser/Users/ian/TestResource/xls/untitled.csv"
  });
  */
$bc_.cb_selectOutFile = null // 选择输出文件的回调
/**
 * 选择输出文件
 * @param params 传递的json对象
 * @param noNcb 非Native状态下，执行
 * @param cb 在Native下，可以通过传递cb来执行
 */
$bc_.selectOutFile = function (paramOptions, noNcb, cb) {
  if ($bc_.pN) {
    try {
      var params = {}

      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_._get_callback(function (obj) {
        if (_.isFunction($bc_.cb_selectOutFile)) {
          $bc_.cb_selectOutFile && $bc_.cb_selectOutFile(obj)
        } else {
          cb && cb(obj)
        }
      }, true)
      params['title'] = paramOptions['title'] || 'Save as'
      params['prompt'] = paramOptions['prompt'] || 'Save'

      params['allowOtherFileTypes'] = false
      params['canCreateDir'] = paramOptions['canCreateDir'] !== false
      params['canAddToRecent'] = true // 是否添加到最近目录中
      params['fileName'] = paramOptions['fileName'] || 'untitled'
      params['directory'] = paramOptions['directory'] || '' // 默认指定的目录
      params['types'] = paramOptions['types'] || ['*'] // 要求的数组

      params['calculateDirSize'] = !!paramOptions['calculateDirSize'] || false

      // 下拉文件类型选择处理
      params['enableFileFormatCombox'] = paramOptions['enableFileFormatCombox'] || false
      params['typesDescript'] = paramOptions['typesDescript'] || []
      params['lable'] = paramOptions['lable'] || 'File Format:'
      params['label'] = paramOptions['label'] || 'File Format:'
      // [end]下拉文件类型选择处理

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key]
        }
      }

      $bc_.pN.window.saveFile(JSON.stringify(params))
    } catch (e) {
      console.error(e)
    }
  } else {
    alert('启动选择输出文件对话框!')
    noNcb && noNcb()
  }
}

// -----------------------------------------------
const filedialog = $bc_
export {
  filedialog
}
