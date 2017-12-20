import { Observable } from '../observable'
import { common } from './common'
import _ from 'lodash'

var $bc_ = common
// IAP 非本地模拟
$bc_['IAP_SE_KEY'] = 'RSSDK_SE_SANBOX_IAP'
$bc_['IAP_SE_OBJ'] = {}
$bc_['IAP_SE_Wrapper'] = {
  _caller: 0,
  productIdentifiers: [], // 商品的ID 数组
  caller: function () { // 消息回调处理
    if (this._caller === 0) {
      var $ = common.getJQuery$()
      this._caller = _.isUndefined($) ? (new Observable()) : $.Callbacks()
    }
    return this._caller
  }
}

// IAP 功能封装
$bc_['cb_handleIAPCallback'] = null // IAP的回调函数
$bc_.IAP = {
  _pNoticeCenter: 0,
  NoticeCenter: function () {
    if (this._pNoticeCenter === 0) {
      var $ = common.getJQuery$()
      this._pNoticeCenter = _.isUndefined($) ? (new Observable()) : $.Callbacks()
    }
    return this._pNoticeCenter
  }, // 参照Jquery.Callbacks消息回调处理。增加动态注册监控信息的回调处理。是一种扩展
  MessageType: (function () { // 开放内核中的消息
    var msg = [
      // /{常用购买流程}
      'ProductsLoaded',
      'ProductBuyFailed',
      'ProductPurchased',
      'ProductPurchaseFailed',
      'ProductPurchaseFailedDetail',
      'ProductRequested',
      'ProductCompletePurchased',

      // /{恢复购买部分}
      'ProductsPaymentQueueRestoreCompleted',
      'ProductsPaymentRestoreCompletedTransactionsFailed',
      'ProductsPaymentRemovedTransactions',
      'ProductsPaymentUpdatedDownloads'
    ]

    var obj = {}
    var i = 0
    for (i = 0; i < msg.length; ++i) {
      var msgType = msg[i]
      obj[msgType] = msgType
    }

    return obj
  })(),

  data: {
    // / 产品信息是否发送请求核实并得到同步信息过。IAP机制
    productIsRequested: false,

    // / 内置产品Map
    productInfoMap: {},
    // / 内置的产品信息List
    productInfoList: [],

    // /Methods
    reInit: function () { // / 核心重新初始化
      var t$ = this
      t$.productIsRequested = false
      t$.productInfoMap = {}
      t$.productInfoList = []
    },
    getProductObj: function (productIdentifier) { // / 获取商品对象
      var t$ = this
      var obj = null
      if (t$.productInfoMap[productIdentifier]) {
        obj = t$.productInfoMap[productIdentifier]
      }
      return obj
    },
    getPrice: function (productIdentifier) {
      var t$ = this
      var obj = t$.getProductObj(productIdentifier)
      if (obj) {
        return obj.price
      }

      return null
    },
    getDescription: function (productIdentifier) {
      var t$ = this
      var obj = t$.getProductObj(productIdentifier)
      if (obj) {
        return obj.description
      }

      return null
    }

  },

  // ///////////////////////////////////////////////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////
  // / 获取本地配置是否可以使用IAP。参见：project.json
  getEnable: function () {
    if ($bc_.pN) {
      try {
        return $bc_.pN.app.getIAPEnable()
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('Romanysoft SDK simulation environment....')
      try {
        var obj = window.localStorage.getItem($bc_.IAP_SE_KEY)
        if (!obj) {
          window.localStorage.setItem($bc_.IAP_SE_KEY, JSON.stringify($bc_.IAP_SE_OBJ))
        } else {
          $bc_.IAP_SE_OBJ = JSON.parse(obj)
        }

        return true // 非本地环境返回True，方便测试
      } catch (error) {
        console.error(error)
      }
    }
    return false
  },

  enableIAP: function (paramOptions, cb) {
    var t$ = this

    try {
      var params = {}
      params['cb_IAP_js'] = paramOptions['cb_IAP_js'] || $bc_._get_callback(function (obj) {
        // ////////////////////////内部处理//////////////////////////////////
        try {
          if (_.isObject(obj)) {
            var info = obj.info
            var notifyType = obj.notifyType

            if (notifyType === t$.MessageType['ProductRequested']) {
              if (typeof info === 'string') {
                info = JSON.parse(info)
              }

              t$.data.productIsRequested = true
              t$.data.productInfoList = info

              _.each(t$.data.productInfoList, function (product, index, list) {
                t$.data.productInfoMap[product.productIdentifier] = {
                  productIdentifier: product.productIdentifier, // 商品ID
                  description: product.description || '', // 商品描述
                  buyUrl: product.buyUrl || '', // 外部购买链接
                  price: product.price || '' // 价格
                }
              })
            }
          }
        } catch (e) {
          console.error(e)
        }

        try {
          $bc_.IAP.NoticeCenter().fire(obj)
        } catch (e) {}

        // /////////////////////////外部处理/////////////////////////////////
        if (_.isFunction($bc_.cb_handleIAPCallback)) {
          $bc_.cb_handleIAPCallback && $bc_.cb_handleIAPCallback(obj)
        } else {
          cb && cb(obj)
        }

        // ////////////////////////////////////////////////////////////////
      }, true)

      // / 数据校验
      console.assert(_.isString(params['cb_IAP_js']) && !_.isEmpty(params['cb_IAP_js']), 'must be function string and not empty')

      // /Ian(原先的方式)
      if (_.isArray(paramOptions['productIds'])) {
        params['productIds'] = paramOptions['productIds'] || []
      }

      // /Ian 2016.12.06 现在的方式. 支持更高级的商品属性定义传入
      params['products'] = []
      if (_.isArray(paramOptions['products'])) { // [{productIdentifier, description, buyUrl, price}]
        try {
          var productIds = []
          _.each(paramOptions['products'], function (product, index, list) {
            productIds.push(product.productIdentifier)
          })

          if (_.isUndefined(params['productIds'] || _.isNull(params['productIds']))) {
            params['productIds'] = productIds
          }

          params['products'] = paramOptions['products']
        } catch (e) {
          console.error(e)
          alert(e)
        }
      }

      // / 统一向后兼容处理
      for (var key in paramOptions) {
        if (paramOptions.hasOwnProperty(key)) {
          params[key] = paramOptions[key]
        }
      }

      if ($bc_.pN) {
        // 注册IAP回调
        $bc_.pN.iap.regeditIAPCallbackJs(params.cb_IAP_js)

        // 注册IAPBundle
        $bc_.pN.iap.regeditIAPCore(JSON.stringify({
          path: $bc_.getAppPluginDir() + $bc_.pIAPPlugin.path
        }))

        // 看看是否可以购买
        if ($bc_.pN.iap.canMakePayments()) {
          // 启动服务
          $bc_.pN.iap.startIAPService()

          // 发送商品请求
          $bc_.pN.iap.requestProducts(JSON.stringify({
            productIdentifiers: params.productIds || [],
            products: params['products'] || []
          }))
        }

        // / 以下是Demo 处理

        // /注册模拟IAP回调
        $bc_.IAP_SE_Wrapper.caller().add(function (obj) {
          console.assert(_.isString(params.cb_IAP_js) && !_.isEmpty(params.cb_IAP_js), 'must be function string and not empty')

          var fnc = window.eval(params.cb_IAP_js)
          if (_.isFunction(fnc)) {
            fnc && fnc(obj)
          }
        })

        // /注册商品ID
        $bc_.IAP_SE_Wrapper.productIdentifiers = params.productIds || []

        var productsInfo = []
        _.each(params.productIds, function (id, index, list) {
          var productObj = {
            productIdentifier: id,
            description: 'Plugin Description and price demo for ' + id,
            buyUrl: '',
            price: '$0.99'
          }

          productsInfo.push(productObj)
        })

        // /模拟发送获取产品信息
        $bc_.IAP_SE_Wrapper.caller().fire({
          notifyType: t$.MessageType.ProductRequested,
          info: productsInfo
        })
      }
    } catch (e) {
      console.error(e)
    }
  },

  _rebuildInfo: function () { // 重新构建
    var t$ = this

    try {
      if ($bc_.pN) {
        $bc_.pN.iap.resetAll()
      } else {
        window.localStorage.removeItem($bc_.IAP_SE_KEY)
      }

      t$.data.reInit()
    } catch (e) {}
  },
  _check: function (productIdentifier) { // 验证数据
    var t$ = this

    var checkFalse = _.isUndefined(productIdentifier) || _.isNull(productIdentifier)
    // 检测必须的参数
    console.assert(checkFalse === false, 'productIdentifier 必须赋值')
    // 产品必须已经注册过
    var isExists = t$.data.productInfoMap.hasOwnProperty(productIdentifier)
    console.assert(isExists === true, '指定的productIdentifier 必须已经注册，通过EnableIAP注册接口')

    if (!isExists) {
      var msg = 'Product [' + productIdentifier + "] is not registered... please see 'EnableIAP' function"
      alert(msg)
    }

    return isExists
  },

  /**
   * 恢复购买操作
   * @param successCallback 恢复成功后的回调, 传值参数为上的商品列表[{标识及数量}]，和消息内容
   * @param failCallback 恢复失败后的回调。原失败的内容
   */
  restore: function (successCallback, failCallback) {
    var t$ = this

    // ////////////////////////////////////////////////////////////////////////////
    var _cb = function (obj) {
      try {
        $bc_.IAP.NoticeCenter().remove(_cb)
        if (_.isObject(obj)) {
          var info = obj.info
          var notifyType = obj.notifyType

          if (notifyType === t$.MessageType['ProductsPaymentQueueRestoreCompleted']) {
            successCallback && successCallback(info)
          } else if (t$.MessageType['ProductsPaymentRestoreCompletedTransactionsFailed']) {
            failCallback && failCallback(info, obj)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    // 注册一个消息回调
    $bc_.IAP.NoticeCenter().add(_cb)

    if ($bc_.pN) {
      // 发送购买请求
      $bc_.pN.iap.restoreIAP()
    } else {
      console.log('Romanysoft SDK simulation environment....')
      var obj = window.localStorage.getItem($bc_.IAP_SE_KEY)
      if (obj) {
        $bc_.IAP_SE_OBJ = JSON.parse(obj)
      }

      var purchasedItemList = [] // 声明原先已经购买的商品列表

      // /检测所有已经注册的ID
      _.each($bc_.IAP_SE_Wrapper.productIdentifiers, function (productID, index, list) {
        if ($bc_.IAP_SE_OBJ.hasOwnProperty(productID)) {
          var quantity = $bc_.IAP_SE_OBJ[productID]
          if (quantity > 0) {
            var purchasedItem = {
              productIdentifier: productID,
              quantity: quantity
            }

            purchasedItemList.push(purchasedItem)
          }
        }
      })

      // /模拟发送获取产品信息
      $bc_.IAP_SE_Wrapper.caller().fire({
        notifyType: t$.MessageType['ProductsPaymentQueueRestoreCompleted'],
        info: purchasedItemList
      })
    }
  },

  /**
   * 购买商品
   * @param params {} 参数productIdentifier： 购买的商品唯一标识， quantity： 购买的商品数量
   * @param successCallback 购买成功后的回调, 传值参数为商品标识，和消息内容
   * @param failCallback 购买失败后的回调，传值参数为商品标识，和消息内容
   */
  buyProduct: function (params, successCallback, failCallback) {
    var t$ = this
    if (!t$._check(params.productIdentifier)) return

    // ////////////////////////////////////////////////////////////////////////////
    var _cb = function (obj) {
      try {
        $bc_.IAP.NoticeCenter().remove(_cb)
        if (_.isObject(obj)) {
          var info = obj.info
          var notifyType = obj.notifyType

          if (info.productIdentifier === params.productIdentifier) {
            if (notifyType === t$.MessageType['ProductPurchased']) {
              successCallback && successCallback(info.productIdentifier, obj)
            } else if (t$.MessageType['ProductPurchaseFailed']) {
              failCallback && failCallback(info.productIdentifier, obj)
            }
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    // 注册一个消息回调
    $bc_.IAP.NoticeCenter().add(_cb)

    if ($bc_.pN) {
      // 发送购买请求
      $bc_.pN.iap.buyProduct(JSON.stringify({
        identifier: params.productIdentifier,
        quantity: params.quantity || 1
      }))
    } else {
      console.log('Romanysoft SDK simulation environment....')
      var obj = window.localStorage.getItem($bc_.IAP_SE_KEY) || JSON.stringify({})

      $bc_.IAP_SE_OBJ = JSON.parse(obj)
      var orgQuantity = 0
      var saveQuantity = 0
      if ($bc_.IAP_SE_OBJ[params.productIdentifier]) {
        orgQuantity = $bc_.IAP_SE_OBJ[params.productIdentifier]
        saveQuantity = orgQuantity + params.quantity || 1
      } else {
        saveQuantity = params.quantity || 1
      }

      $bc_.IAP_SE_OBJ[params.productIdentifier] = saveQuantity
      window.localStorage.setItem($bc_.IAP_SE_KEY, JSON.stringify($bc_.IAP_SE_OBJ))

      // 模拟发送成功购买信息
      $bc_.IAP_SE_Wrapper.caller().fire({
        notifyType: t$.MessageType['ProductPurchased'],
        info: {
          productIdentifier: params.productIdentifier,
          quantity: saveQuantity
        }
      })

      // 模拟发送购买完成信息
      $bc_.IAP_SE_Wrapper.caller().fire({
        notifyType: t$.MessageType['ProductCompletePurchased'],
        info: {
          productIdentifier: params.productIdentifier,
          transactionId: 'transactionId' + Math.round(999),
          receipt: 'receipt' + Math.round(999)
        }
      })
    }
  },

  getPrice: function (productIdentifier) {
    var t$ = this
    if (!t$._check(productIdentifier)) return

    if ($bc_.pN) {
      if ($bc_.App.getSandboxEnable()) {
        return $bc_.pN.iap.getPrice(productIdentifier)
      } else {
        return t$.data.getPrice(productIdentifier)
      }
    } else {
      console.log('Romanysoft SDK simulation environment....')
      return t$.data.getPrice(productIdentifier)
    }
  },

  getUseableProductCount: function (productIdentifier) {
    var t$ = this
    if (!t$._check(productIdentifier)) return

    if ($bc_.pN) {
      return $bc_.pN.iap.getUseableProductCount(productIdentifier) || 0
    } else {
      console.log('Romanysoft SDK simulation environment....')
      var quantity = 0

      var obj = window.localStorage.getItem($bc_.IAP_SE_KEY) || JSON.stringify({})
      if (obj) {
        $bc_.IAP_SE_OBJ = JSON.parse(obj)
        quantity = $bc_.IAP_SE_OBJ[productIdentifier] || 0
      }

      return quantity
    }
  },

  setUseableProductCount: function (jsonObj) {
    var t$ = this
    if (!t$._check(jsonObj.productIdentifier)) return

    if ($bc_.pN) {
      var params = {
        identifier: jsonObj.productIdentifier || '',
        quantity: jsonObj.quantity || 1
      }
      return $bc_.pN.iap.setUseableProductCount(JSON.stringify(params)) || 0
    } else {
      console.log('Romanysoft SDK simulation environment....')
      var obj = window.localStorage.getItem($bc_.IAP_SE_KEY) || JSON.stringify({})
      if (obj) {
        $bc_.IAP_SE_OBJ = JSON.parse(obj)

        var saveQuantity = jsonObj.quantity || 1
        $bc_.IAP_SE_OBJ[jsonObj.productIdentifier] = saveQuantity
        window.localStorage.setItem($bc_.IAP_SE_KEY, JSON.stringify($bc_.IAP_SE_OBJ))
        return saveQuantity || 0
      }
    }

    return 0
  },

  add1Useable: function (productIdentifier) {
    var t$ = this
    if (!t$._check(productIdentifier)) return

    if ($bc_.pN) {
      return $bc_.pN.iap.add1Useable(productIdentifier) || 0
    } else {
      console.log('Romanysoft SDK simulation environment....')
      var obj = window.localStorage.getItem($bc_.IAP_SE_KEY) || JSON.stringify({})
      if (obj) {
        $bc_.IAP_SE_OBJ = JSON.parse(obj)

        var orgQuantity = 0
        var saveQuantity = 0
        if ($bc_.IAP_SE_OBJ[productIdentifier]) {
          orgQuantity = $bc_.IAP_SE_OBJ[productIdentifier] || 0
          saveQuantity = orgQuantity + 1
        }

        $bc_.IAP_SE_OBJ[productIdentifier] = saveQuantity
        window.localStorage.setItem($bc_.IAP_SE_KEY, JSON.stringify($bc_.IAP_SE_OBJ))

        return saveQuantity
      }
    }

    return 0
  },

  sub1Useable: function (productIdentifier) {
    var t$ = this
    if (!t$._check(productIdentifier)) return

    if ($bc_.pN) {
      return $bc_.pN.iap.sub1Useable(productIdentifier) || 0
    } else {
      console.log('Romanysoft SDK simulation environment....')
      var obj = window.localStorage.getItem($bc_.IAP_SE_KEY) || JSON.stringify({})
      if (obj) {
        $bc_.IAP_SE_OBJ = JSON.parse(obj)

        var orgQuantity = 0
        var saveQuantity = 0
        if ($bc_.IAP_SE_OBJ[productIdentifier]) {
          orgQuantity = $bc_.IAP_SE_OBJ[productIdentifier]
          saveQuantity = orgQuantity - 1
        }

        saveQuantity = saveQuantity > 0 ? saveQuantity : 0
        $bc_.IAP_SE_OBJ[productIdentifier] = saveQuantity
        window.localStorage.setItem($bc_.IAP_SE_KEY, JSON.stringify($bc_.IAP_SE_OBJ))

        return saveQuantity
      }
    }

    return 0
  }
}

//
// -----------------------------------------------
const iap = $bc_
export {
  iap
}
