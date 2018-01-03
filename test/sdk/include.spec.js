import { Tool } from '../../src/dove.sdk/include'

describe('SDK.Include', () => {
  it('Tool getType', () => {
    expect(Tool.getType({})).toEqual('[object Object]')
  })

  it('Tool isUndefinedOrNull', () => {
    expect(Tool.isUndefinedOrNull({})).toEqual(false)
    expect(Tool.isUndefinedOrNull(false)).toEqual(false)
    expect(Tool.isUndefinedOrNull(true)).toEqual(false)
    expect(Tool.isUndefinedOrNull(undefined)).toEqual(true)
    expect(Tool.isUndefinedOrNull(new Date())).toEqual(false)
    expect(Tool.isUndefinedOrNull(null)).toEqual(true)
  })

  it('Tool param2Array', () => {
    expect(Tool.param2Array('port=09090', ['[string]'])).toEqual([])
  })

  it('Tool arguments2Array', () => {
    expect(Tool.arguments2Array(1, 'code', { options: { name: 'tool' }})).toEqual([
      1,
      'code',
      { options: { name: 'tool' }}
    ])
  })

  it('Tool getErrorMessage', () => {
    expect(Tool.getErrorMessage('myError')).toEqual('myError')
    expect(Tool.getErrorMessage({ data: 'error' })).toEqual('data=error')
    expect(Tool.getErrorMessage(new Error('error'))).toEqual('error')
  })

  it('Tool compareVersion', () => {
    expect(Tool.compareVersion(10101, 10100)).toEqual(1)
    expect(Tool.compareVersion('10101', '10100')).toEqual(1)
    expect(Tool.compareVersion('10101', 10100)).toEqual(1)

    expect(Tool.compareVersion('1.1.0', '1.0')).toEqual(1)
    expect(Tool.compareVersion('1.1.0', '1.1')).toEqual(0)
    expect(Tool.compareVersion('1.1.10', '1.1.0')).toEqual(1)
    expect(Tool.compareVersion('1.0.0', '1.0.20')).toEqual(-1)
    expect(Tool.compareVersion('1.1.0', '1.0.20')).toEqual(1)
    expect(Tool.compareVersion('1.20.6', '1.0.20')).toEqual(1)
    expect(Tool.compareVersion('1.0.6', '0.0.0')).toEqual(1)

    expect(Tool.compareVersion('1.0.6', '')).toEqual(0)
  })

  describe('Test Tool.isBlank', function () {
    it('Tool isBlank', () => {
      expect(Tool.isBlank('')).toEqual(true)
      expect(Tool.isBlank(' ')).toEqual(true)
      expect(Tool.isBlank('\n')).toEqual(true)
      expect(Tool.isBlank('\n\n')).toEqual(true)
      expect(Tool.isBlank(' \n')).toEqual(true)

      expect(Tool.isBlank('s')).toEqual(false)
      expect(Tool.isBlank('s ')).toEqual(false)

      expect(Tool.isBlank(null)).toEqual(true)
      expect(Tool.isBlank(true)).toEqual(true)
      expect(Tool.isBlank({})).toEqual(true)
      expect(Tool.isBlank([])).toEqual(true)
    })
  })

  describe('Test Tool.queue', function () {
    var foo = null

    beforeEach(function () {
      foo = {
        setBar: function (value) {
          value++
        }
      }

      spyOn(foo, 'setBar')
    })

    it('Tool Queue', function () {
      Tool.queue().next(function (nxt) {
        foo.setBar(123)
        nxt && nxt()
      }).next(function (nxt) {
        foo.setBar(456, 'another param')
        nxt && nxt()
      }).done(function (done) {
        foo.setBar(456, 'another param')
      })

      expect(foo.setBar).toHaveBeenCalledTimes(3)
    })
  })
})
