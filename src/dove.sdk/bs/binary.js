import { common } from './common'

var $bc_ = common

/**
 * 二进制扩展
 * @type {{createBinaryFile: Function, createTextFile: Function, getUTF8TextContentFromFile: Function, base64ToFile: Function, base64ToImageFile: Function, imageFileConvertToOthers: Function}}
 */
$bc_.Binary = {
  createBinaryFile: function (in_parms, cb) {
    try {
      var parms = {}
      // 限制内部属性：
      parms['callback'] = in_parms['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      parms['filePath'] = in_parms['filePath'] || ''
      parms['data'] = in_parms['data'] || ''
      parms['offset'] = in_parms['offset'] || 0
      parms['dataAppend'] = in_parms['dataAppend'] || false

      // / 统一向后兼容处理
      for (var key in in_parms) {
        if (in_parms.hasOwnProperty(key)) {
          parms[key] = in_parms[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.binaryFileWriter.writeBinaryArray(JSON.stringify(parms))
      } else {
        alert('创建二进制文件')
      }
    } catch (e) {
      console.error(e)
    }
  },

  createTextFile: function (in_parms, cb) {
    try {
      var parms = {}
      // 限制内部属性：
      parms['callback'] = in_parms['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      parms['filePath'] = in_parms['filePath'] || ''
      parms['text'] = in_parms['text'] || ''
      parms['offset'] = in_parms['offset'] || 0
      parms['dataAppend'] = in_parms['dataAppend'] || false

      // / 统一向后兼容处理
      for (var key in in_parms) {
        if (in_parms.hasOwnProperty(key)) {
          parms[key] = in_parms[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.binaryFileWriter.writeTextToFile(JSON.stringify(parms))
      } else {
        alert('创建文本文件')
      }
    } catch (e) {
      console.error(e)
    }
  },

  getUTF8TextContentFromFile: function (in_parms, cb) {
    try {
      var parms = {}
      // 限制内部属性：
      parms['callback'] = in_parms['callback'] || $bc_._get_callback(function (obj) {
        /**
         obj.success = true || false
         obj.content =  //内容
         obj.error =    //出错信息
         **/
        cb && cb(obj)
      }, true)
      parms['filePath'] = in_parms['filePath'] || ''
      parms['encode'] = in_parms['encode'] || 'utf8'
      parms['async'] = in_parms['async'] !== false // 异步的时候，回调函数有效，否则无效，直接返回内容值

      /**
       encode: 说明，不区分大小写
       ASCII,NEXTSTEP,JapaneseEUC,UTF8,ISOLatin1,Symbol,NonLossyASCII,ShiftJIS,ISOLatin2,Unicode
       WindowsCP1251,WindowsCP1252,WindowsCP1253,WindowsCP1254,WindowsCP1250,ISO2022JP,MacOSRoman
       UTF16,UTF16BigEndian,UTF16LittleEndian
       **/

      // / 统一向后兼容处理
      for (var key in in_parms) {
        if (in_parms.hasOwnProperty(key)) {
          parms[key] = in_parms[key]
        }
      }

      if ($bc_.pN) {
        return $bc_.pN.binaryFileWriter.getTextFromFile(JSON.stringify(parms)) // 使用非异步模式(async == false)，直接返回content内容
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

  base64ToFile: function (in_parms, cb) {
    try {
      var parms = {}
      // 限制内部属性：
      parms['callback'] = in_parms['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      parms['filePath'] = in_parms['filePath'] || ''
      parms['base64String'] = in_parms['base64String'] || ''
      parms['dataAppend'] = in_parms['dataAppend'] || false

      // / 统一向后兼容处理
      for (var key in in_parms) {
        if (in_parms.hasOwnProperty(key)) {
          parms[key] = in_parms[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.binaryFileWriter.base64ToFile(JSON.stringify(parms))
      } else {
        alert('base64编码保存到文件中')
      }
    } catch (e) {
      console.error(e)
    }
  },

  base64ToImageFile: function (in_parms, cb) {
    try {
      var parms = {}
      // 限制内部属性：
      parms['callback'] = in_parms['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      parms['filePath'] = in_parms['filePath'] || ''
      parms['base64String'] = in_parms['base64String'] || ''
      parms['imageType'] = in_parms['imageType'] || 'jpeg' // png,bmp

      // / 统一向后兼容处理
      for (var key in in_parms) {
        if (in_parms.hasOwnProperty(key)) {
          parms[key] = in_parms[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.binaryFileWriter.base64ToImageFile(JSON.stringify(parms))
      } else {
        alert('base64编码保存到图片文件中')
      }
    } catch (e) {
      console.error(e)
    }
  },

  imageFileConvertToOthers: function (in_parms, cb) {
    try {
      var parms = {}
      // 限制内部属性：
      parms['callback'] = in_parms['callback'] || $bc_._get_callback(function (obj) {
        cb && cb(obj)
      }, true)
      parms['filePath'] = in_parms['filePath'] || '' // 目标文件
      parms['orgFilePath'] = in_parms['orgFilePath'] || '' // 源文件
      parms['imageType'] = in_parms['imageType'] || 'jpeg' // png,bmp

      // / 统一向后兼容处理
      for (var key in in_parms) {
        if (in_parms.hasOwnProperty(key)) {
          parms[key] = in_parms[key]
        }
      }

      if ($bc_.pN) {
        $bc_.pN.binaryFileWriter.imageFileConvertToOthers(JSON.stringify(parms))
      } else {
        alert('图片格式转换')
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

