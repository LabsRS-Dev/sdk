import { common } from './common'

var $bc_ = common

/**
 * 二进制扩展
 * @type {{createBinaryFile: Function, createTextFile: Function, getUTF8TextContentFromFile: Function, base64ToFile: Function, base64ToImageFile: Function, imageFileConvertToOthers: Function}}
 */
$bc_.Binary = {
  createBinaryFile: function (paramOptions, cb) {
    try {
      var params = {}
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      params['filePath'] = paramOptions['filePath'] || ''
      params['data'] = paramOptions['data'] || ''
      params['offset'] = paramOptions['offset'] || 0
      params['dataAppend'] = paramOptions['dataAppend'] || false

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.binaryFileWriter.writeBinaryArray(JSON.stringify(params))
      } else {
        alert('创建二进制文件')
      }
    } catch (e) {
      console.error(e)
    }
  },

  createTextFile: function (paramOptions, cb) {
    try {
      var params = {}
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      params['filePath'] = paramOptions['filePath'] || ''
      params['text'] = paramOptions['text'] || ''
      params['offset'] = paramOptions['offset'] || 0
      params['dataAppend'] = paramOptions['dataAppend'] || false

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.binaryFileWriter.writeTextToFile(JSON.stringify(params))
      } else {
        alert('创建文本文件')
      }
    } catch (e) {
      console.error(e)
    }
  },

  getUTF8TextContentFromFile: function (paramOptions, cb) {
    try {
      var params = {}
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_._get_callback(function (obj) {
        /**
         obj.success = true || false
         obj.content =  //内容
         obj.error =    //出错信息
         **/
        cb && cb(obj)
      }, true)
      params['filePath'] = paramOptions['filePath'] || ''
      params['encode'] = paramOptions['encode'] || 'utf8'
      params['async'] = paramOptions['async'] !== false // 异步的时候，回调函数有效，否则无效，直接返回内容值

      /**
       encode: 说明，不区分大小写
       ASCII,NEXTSTEP,JapaneseEUC,UTF8,ISOLatin1,Symbol,NonLossyASCII,ShiftJIS,ISOLatin2,Unicode
       WindowsCP1251,WindowsCP1252,WindowsCP1253,WindowsCP1254,WindowsCP1250,ISO2022JP,MacOSRoman
       UTF16,UTF16BigEndian,UTF16LittleEndian
       **/

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key]
        }
      }

      if ($bc_.pN) {
        return $bc_.pN.binaryFileWriter.getTextFromFile(JSON.stringify(params)) // 使用非异步模式(async == false)，直接返回content内容
      } else {
        alert('获取文本文件中的内容（UTF8编码）')
        cb && cb({
          success: true,
          text: ''
        })
      }
    } catch (e) {
      console.error(e)
    }
  },

  base64ToFile: function (paramOptions, cb) {
    try {
      var params = {}
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      params['filePath'] = paramOptions['filePath'] || ''
      params['base64String'] = paramOptions['base64String'] || ''
      params['dataAppend'] = paramOptions['dataAppend'] || false

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.binaryFileWriter.base64ToFile(JSON.stringify(params))
      } else {
        alert('base64编码保存到文件中')
      }
    } catch (e) {
      console.error(e)
    }
  },

  base64ToImageFile: function (paramOptions, cb) {
    try {
      var params = {}
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      params['filePath'] = paramOptions['filePath'] || ''
      params['base64String'] = paramOptions['base64String'] || ''
      params['imageType'] = paramOptions['imageType'] || 'jpeg' // png,bmp

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.binaryFileWriter.base64ToImageFile(JSON.stringify(params))
      } else {
        alert('base64编码保存到图片文件中')
      }
    } catch (e) {
      console.error(e)
    }
  },

  imageFileConvertToOthers: function (paramOptions, cb) {
    try {
      var params = {}
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      params['filePath'] = paramOptions['filePath'] || '' // 目标文件
      params['orgFilePath'] = paramOptions['orgFilePath'] || '' // 源文件
      params['imageType'] = paramOptions['imageType'] || 'jpeg' // png,bmp

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.binaryFileWriter.imageFileConvertToOthers(JSON.stringify(params))
      } else {
        alert('图片格式转换')
      }
    } catch (e) {
      console.error(e)
    }
  },

  getImageFileInfo: function (paramOptions, cb) {
    try {
      var params = {}
      // 限制内部属性：
      params['callback'] = paramOptions['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      params['path'] = paramOptions['path'] || '' // image 文件路径

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.binaryFileWriter.getImageFileInfo(JSON.stringify(params))
      } else {
        console.warn('call native engine get image file info ...')
        cb && cb({
          success: true,
          data: { width: 512, height: 512 }
        })
      }
    } catch (e) {
      console.error(e)
    }
  },

  Sound: {
    playResourceSoundFile: function (fileUrl) {
      if ($bc_.pN) $bc_.pN.sound.play(fileUrl)
    }
  },

  Video: {}

}

//
// -----------------------------------------------
const binary = $bc_
export {
  binary
}

