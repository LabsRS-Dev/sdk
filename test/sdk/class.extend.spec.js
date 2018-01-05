import { Observable, SelfClass } from '../../src/dove.sdk/observable'
import _ from 'lodash'

describe('SDK.Class', () => {
  it('Class: extend issues es not this', () => {
    var __$p$ = {
      name: '123',
      getName: () => {
        expect(this).toEqual(undefined)
      }
    }

    var Persion = SelfClass.extend(__$p$)
    var man = new Persion()
    man.getName()
  })

  it('Class: extend issues', () => {
    var __$p$ = {
      name: '123',
      getName: function () {
        return this.name
      }
    }

    var Persion = SelfClass.extend(__$p$)
    var man = new Persion()

    expect(man.getName()).toEqual('123')
  })

  // this.__mc = new Observable()
})

describe('SDK.Observable', () => {
  it('Observable: Test trigger method ..', () => {
    const mc = new Observable()

    const stringV = 'BestForYou'
    mc.bind('hello', (msgObj) => {
      expect(msgObj.data).toEqual(stringV)
    }, false)
    mc.trigger('hello', stringV)

    const boolV = true
    mc.bind('helloBool', (msgObj) => {
      expect(msgObj.data).toEqual(boolV)
    }, false)
    mc.trigger('helloBool', boolV)

    const info = { 'myName': 'ian' }
    mc.bind('helloInfo', (msgObj) => {
      expect(msgObj.data).toEqual(info)
    }, false)
    mc.trigger('helloInfo', info)

    const nullV = null
    mc.bind('helloNull', (msgObj) => {
      expect(msgObj.data).toEqual(nullV)
    }, false)
    mc.trigger('helloNull', nullV)

    const undefinedV = undefined
    mc.bind('helloUndefined', (msgObj) => {
      expect(msgObj.data).toEqual(undefinedV)
    }, false)
    mc.trigger('helloUndefined', undefinedV)
  })

  it('Observable: Test each register and unregister method ..', () => {
    const mc = new Observable()

    var __$p$ = {
      mc: mc
    }

    const __msgPrefix = ''
    const TypeMsg = {
      OnCreateError: __msgPrefix + 'OnCreateError', // 创建失败
      OnRunning: __msgPrefix + 'OnRunning', // 创建并连接上
    
      OnGetServerMessage: __msgPrefix + 'OnGetServerMessage', // 从服务器获取到信息
      OnSendMessageToServer: __msgPrefix + 'OnSendMessageToServer' // 向服务器发送信息
    }

    // 批量处理注册及接收方式
    _.each(TypeMsg, function (eventType, key, list) {
      var registerKey = 'register' + key
      var unregisterKey = 'unregister' + key

      __$p$[registerKey] = function (handler, one = false) {
        __$p$.mc.bind(eventType, handler, one)
      }
      __$p$[unregisterKey] = function (handler) {
        __$p$.mc.unbind(eventType, handler)
      }
    })

    console.log("mc = ")
    console.dir(__$p$.mc)

    console.log("__$p$ = ")
    console.dir(__$p$)

    expect(_.isFunction(__$p$['registerOnCreateError'])).toEqual(true)
    expect(_.isFunction(__$p$['registerOnCreateError2'])).toEqual(false)

    const msg = 'Hello'
    __$p$.registerOnCreateError(function(msgObj){
      console.log("[1]registerOnCreateError ...")
      expect(msgObj.data).toEqual(msg)
    })
    __$p$.registerOnSendMessageToServer(function(msgObj){
      console.log("[2]registerOnSendMessageToServer: ...")
      expect(msgObj.data).toEqual(msg)
    })
    __$p$.mc.trigger(TypeMsg.OnCreateError, msg)
  })
})
