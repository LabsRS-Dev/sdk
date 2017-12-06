import { common } from '../../src/dove.sdk/bs/common'

describe('SDK.BS.common', () => {
  it('_get_callback', () => {
    var cbName1 = common._get_callback(function () {}, true)
    var cbName2 = common._get_callback(function () {}, true)

    expect(cbName1).not.toEqual(cbName2)
  })
})
