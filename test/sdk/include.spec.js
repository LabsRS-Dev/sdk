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
})
