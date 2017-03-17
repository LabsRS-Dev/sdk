import { AgentClient } from '../../src/dove.sdk/bs/agent.client'

describe('AgentClient', () => {
  it('AgentClient: create normal', () => {
    const agent = new AgentClient()
    var msg = 'hello'
    agent.registerOnNoticeToServer((message) => {
      expect(message).toEqual(msg)
    })
  })

  it('AgentClient: create new websocket python Chancel', () => {
    const agent = new AgentClient()
    var newChancel = new agent.Chancel()
    newChancel.build({ port: '9090' })
    var server = newChancel.server
    expect(server).not.toBeUndefined()
  })

  it('create new websocket python Chancel && add', () => {
    const agent = new AgentClient()
    var newChancel = new agent.Chancel()
    newChancel.build({})
    agent.appendChancel(newChancel)
    expect(agent.getChancelCount()).toEqual(1)
  })
})

