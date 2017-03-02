import { common } from './common'
import _ from '../underscore'

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
 * @param parms 参数的json对象
 * @param noNcb 非Native的状态下，执行的回调函数
 * @param cb    Native状态下，执行的回调函数是，默认是优化外部传入函数
 */
$bc_.importFiles = function (in_parms, noNcb, cb) {
  var _this = this
  try {
    var parms = {}
    // 限制内部属性：
    parms['callback'] = in_parms['callback'] || _this._get_callback(function (obj) {
      if (_this.cb_importFiles) {
        _this.cb_importFiles && _this.cb_importFiles(obj)
      } else {
        cb && cb(obj)
      }
    }, true)
    parms['title'] = in_parms['title'] || 'Select a file'
    parms['prompt'] = in_parms['prompt'] || 'Open'

    parms['allowOtherFileTypes'] = in_parms['allowOtherFileTypes'] || false
    parms['allowMulSelection'] = in_parms['allowMulSelection'] || false
    parms['canCreateDir'] = in_parms['canCreateDir'] || false
    parms['canChooseFiles'] = true
    parms['canChooseDir'] = false
    parms['canAddToRecent'] = true // 是否添加到最近目录中
    parms['directory'] = in_parms['directory'] || '' // 默认指定的目录
    parms['types'] = in_parms['types'] || [] // eg. ['png','svg'] 或 ['*']

    // 下拉文件类型选择处理
    parms['enableFileFormatCombox'] = in_parms['enableFileFormatCombox'] || false
    parms['typesDescript'] = in_parms['typesDescript'] || []
    parms['lable'] = in_parms['lable'] || 'File Format:'
    parms['label'] = in_parms['label'] || 'File Format:'
    // [end]下拉文件类型选择处理

    // / 统一向后兼容处理
    for (var key in in_parms) {
      if (in_parms.hasOwnProperty(key)) {
        parms[key] = in_parms[key]
      }
    }

    if ($bc_.pN) {
      $bc_.pN.window.openFile(JSON.stringify(parms))
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
 * @param parms 传递的json对象
 * @param noNcb 非Native状态下，执行
 * @param cb 在Native下，可以通过传递cb来执行
 */
$bc_.selectOutDir = function (in_parms, noNcb, cb) {
  try {
    var parms = {}

    // 限制内部属性：
    parms['callback'] = in_parms['callback'] || $bc_._get_callback(function (obj) {
      if (_.isFunction($bc_.cb_selectOutDir)) {
        $bc_.cb_selectOutDir && $bc_.cb_selectOutDir(obj)
      } else {
        cb && cb(obj)
      }
    }, true)
    parms['title'] = in_parms['title'] || 'Select Directory'
    parms['prompt'] = in_parms['prompt'] || 'Select'

    parms['allowOtherFileTypes'] = false
    parms['canCreateDir'] = in_parms['canCreateDir'] !== false
    parms['canChooseDir'] = true
    parms['canChooseFiles'] = false // 不可以选择文件
    parms['canAddToRecent'] = true // 是否添加到最近目录中
    parms['directory'] = in_parms['directory'] || '' // 默认指定的目录
    parms['types'] = []

    // / 统一向后兼容处理
    for (var key in in_parms) {
      if (in_parms.hasOwnProperty(key)) {
        parms[key] = in_parms[key]
      }
    }

    if ($bc_.pN) {
      $bc_.pN.window.openFile(JSON.stringify(parms))
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
 * @param parms 传递的json对象
 * @param noNcb 非Native状态下，执行
 * @param cb 在Native下，可以通过传递cb来执行
 */
$bc_.selectOutFile = function (in_parms, noNcb, cb) {
  if ($bc_.pN) {
    try {
      var parms = {}

      // 限制内部属性：
      parms['callback'] = in_parms['callback'] || $bc_._get_callback(function (obj) {
        if (_.isFunction($bc_.cb_selectOutFile)) {
          $bc_.cb_selectOutFile && $bc_.cb_selectOutFile(obj)
        } else {
          cb && cb(obj)
        }
      }, true)
      parms['title'] = in_parms['title'] || 'Save as'
      parms['prompt'] = in_parms['prompt'] || 'Save'

      parms['allowOtherFileTypes'] = false
      parms['canCreateDir'] = in_parms['canCreateDir'] !== false
      parms['canAddToRecent'] = true // 是否添加到最近目录中
      parms['fileName'] = in_parms['fileName'] || 'untitled'
      parms['directory'] = in_parms['directory'] || '' // 默认指定的目录
      parms['types'] = in_parms['types'] || ['*'] // 要求的数组

      // 下拉文件类型选择处理
      parms['enableFileFormatCombox'] = in_parms['enableFileFormatCombox'] || false
      parms['typesDescript'] = in_parms['typesDescript'] || []
      parms['lable'] = in_parms['lable'] || 'File Format:'
      parms['label'] = in_parms['label'] || 'File Format:'
      // [end]下拉文件类型选择处理

      // / 统一向后兼容处理
      for (var key in in_parms) {
        if (in_parms.hasOwnProperty(key)) {
          parms[key] = in_parms[key]
        }
      }

      $bc_.pN.window.saveFile(JSON.stringify(parms))
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
