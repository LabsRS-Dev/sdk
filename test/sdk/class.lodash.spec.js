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
  })
})
