import { common } from '../../src/dove.sdk/bs/common'

describe('SDK.BS.common', () => {
  it('Tool getType', () => {
    var cbName1 = common._get_callback(function () {}, true)
    var cbName2 = common._get_callback(function () {}, true)

    expect(cbName1).not.toEqual(cbName2)
  })
})
