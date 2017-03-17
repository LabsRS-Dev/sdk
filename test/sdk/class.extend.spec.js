import { SelfClass } from '../../src/dove.sdk/observable'

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
})
