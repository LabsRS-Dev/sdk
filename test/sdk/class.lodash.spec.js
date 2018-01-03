const _ = require('lodash')

describe('lodash', () => {
  it('lodash: Lang', () => {
    expect(_.isString('')).toBe(true)
    expect(_.isString(' ')).toBe(true)
    expect(_.isString('test')).toBe(true)
    expect(_.isString(' test')).toBe(true)

    expect(_.isString(null)).toBe(false)
    expect(_.isString(undefined)).toBe(false)
    expect(_.isString({})).toBe(false)
    expect(_.isString([])).toBe(false)
    expect(_.isString(function () {})).toBe(false)

    expect(_.isEmpty('')).toBe(true)

    expect(_.isNil('')).toBe(false)

    const obj = { 'info': { 'type': 'media', 'enable': true }}
    var objValue = _.get(obj, 'info.enable1', false)
    expect(objValue).toBe(false)

    objValue = _.get(obj, 'info.enable', false)
    expect(objValue).toBe(true)

    const data = {
      'checkUpdate': {
        'lastVersion': '1.0.0'
      }
    }

    var lastVersion = _.get(data.checkUpdate, 'lastVersion', '0.0.0')
    var lastBuildVersion = _.get(data.checkUpdate, 'lastBuildVersion', '0.0.0')
    expect(lastVersion).toBe('1.0.0')
    expect(lastBuildVersion).toBe('0.0.0')

    var testVersion = _.get(data, 'checkUpdate.lastVersion', '0.0.0')
    expect(testVersion).toBe('1.0.0')
  })
})
