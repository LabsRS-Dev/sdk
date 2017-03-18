import { googleLangIDMaps } from '../../src/dove.sdk/util/googleLangIDMaps'

const gl = googleLangIDMaps

describe('SDK.Util.GoogleLangIDMaps', () => {
  it('Util.GoogleLangIDMaps getGoogleLangID', () => {
    /**
     * 传入兼容的语言标识，获取以Google为基础的语言标识
     * Google标识的语言以简写为主例如en
     */
    expect(gl.getGoogleLangID('zh_cn')).toEqual('zh-CN')
    expect(gl.getGoogleLangID('en-US')).toEqual('en')
    expect(gl.getGoogleLangID('en_US')).toEqual('en')
    expect(gl.getGoogleLangID('en_us')).toEqual('en')
  })
})
