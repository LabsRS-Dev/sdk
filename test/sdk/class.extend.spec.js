import { Observable, SelfClass } from '../../src/dove.sdk/observable'

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
})
