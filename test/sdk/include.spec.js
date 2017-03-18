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
  })

  it('Tool Queue', () => {
    Tool.queue().next(function (nxt) {
      nxt && nxt()
    }).next(function (nxt) {
      nxt && nxt()
    }).done(function (done) {
      expect(Tool.compareVersion(10101, 10100)).toEqual(1)
    })
  })
})
