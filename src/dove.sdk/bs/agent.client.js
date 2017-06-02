import { ProxyClientWebsocketForNode } from './proxy.client.websocket.node'
import { ProxyClientWebsocketForPython } from './proxy.client.websocket.python'
import { ProxyClientNativeFork } from './proxy.client.native.fork'
import { ProxyMessageCenter } from './proxy'
import { SelfClass } from '../observable'
import underscore from '../underscore'

var _ = underscore._

// -----------------------------------------------------------------------
const logCord = '[SDK.agent.client]'

const __key = 'agent-client'
const TypeMsg = {
  // ---------- 抽象上层为发送通知(Notice)及接收信息(Receive)
  OnReceiveFromServer: 'OnReceiveFromServer',
  OnNoticeToServer: 'OnNoticeToServer',

  // ---------- 抽象传输通道的状态变化
  OnStartBuildChannel: 'OnStartBuildChannel', // 开始建立通讯通道
  OnBuildChannelError: 'OnBuildChannelError', // 建立通讯通道发生错误
  OnFinishBuildChannel: 'OnFinishBuildChannel', // 建立通讯通道发生完成
  OnChannelFault: 'OnChannelFault' // 通讯通道意外发生故障
}

// ------------------------------------------------------------------------
// Class Chancel
let ChancelTypeIndex = 0
const ChancelType = {
  websocketForPython: ++ChancelTypeIndex,
  websocketForNode: ++ChancelTypeIndex,
  httpX: ++ChancelTypeIndex,
  nativeFork: ++ChancelTypeIndex
}

class Chancel {
  build (config = {}) {
    config = _.extend({
      type: ChancelType.websocketForPython,
      ip: '127.0.0.1',
      port: '8080',
      protocol: 'ws://', // http://wwww https://wwww
      reqUrl: '/websocket',
      autoReconnectMaxRunTimes: Number.MAX_SAFE_INTEGER
    }, config)

    this.config = config
    this.type = config.type

    if (config.type === ChancelType.websocketForPython) {
      this.proxyObj = new ProxyClientWebsocketForPython()
    } else if (config.type === ChancelType.websocketForNode) {
      this.proxyObj = new ProxyClientWebsocketForNode()
    } else if (config.type === ChancelType.nativeFork) {
      this.proxyObj = new ProxyClientNativeFork()
    }

    if (this.proxyObj) {
      this.proxyObj.initWithConfig(config)
    }
  }

  get server () {
    return this.proxyObj
  }

  active () {
    this.proxyObj.run()
  }
}

class Chancel2HandlerHelper {
  constructor () {
    this.mapAssEvent = {}
    this.mapAssObj = {}
    this.mapAssFnc = {}

    this.getNewFunction = this.getNewFunction.bind(this)
    this.getThatFunctionList = this.getThatFunctionList.bind(this)
  }

  getNewFunction (assEvent, assObj, fnc) {
    var key = _.uniqueId(logCord + '__chancel2HandlerHelp__')
    var that = this
    that.mapAssObj[key] = assObj
    that.mapAssFnc[key] = fnc
    that.mapAssEvent[key] = assEvent
    return fnc
  }

  getThatFunctionList (assEvent, assObj) {
    var that = this
    var _fnList = []
    _.each(_.kes(that.mapAssObj), function (key) {
      if (assObj === that.mapAssObj[key] &&
      assEvent === that.mapAssEvent[key]
      ) {
        _fnList.push(that.mapAssFnc[key])
      }
    })
    return _fnList
  }

}

// ------------------------------------------------------------------------
// Class AgentClient
var __$p$ = {
  name: __key,
  mc: new ProxyMessageCenter(),
  getMsgHelper: function () {
    return this.mc
  },
  getInternalMessageType: function () {
    return TypeMsg
  },
  debug: false, // 时候开启Debug模式
  log: function (title, message, end = '') {
    if (this.debug) {
      console.log(title, message, end)
    }
  },
  // ------------------ log -------------------------------------------------
  _traceLogEventsCount: function () {
    var that = this
    const _events = that.mc.getEvents()
    that.log(logCord, ' _events count = ' + _.keys(_events).length)
  },
  // --------------------------------------------------------
  init: function () {
    var that = this
    that.debug = true
  },
  // --------------- 信息交互 通道建立 ------------------------
  ChancelType: ChancelType,
  Chancel: Chancel,
  __chancelList: [],   // 通讯通道对象
  getChancelCount: function () {
    var that = this
    return that.__chancelList.length
  },
  chancel2HandlerHelper: new Chancel2HandlerHelper(),
  appendChancel: function (chancel, handler) {
    var that = this
    var _c2hh = that.chancel2HandlerHelper
    var _c2hhFn = _c2hh.getNewFunction
    var _cs = chancel.server
    var _msgType = _cs.getInternalMessageType()

    // 建立信息关联
    if (chancel.type === ChancelType.websocketForNode ||
    chancel.type === ChancelType.websocketForPython
    ) {
      console.dir(chancel.server)
      _cs.registerOnWSGetServerMessage(_c2hhFn(_msgType.OnWSGetServerMessage, _cs, (message) => { that.onReceiveFromServer(message) }))
      _cs.registerOnSendMessageToServer(_c2hhFn(_msgType.OnSendMessageToServer, _cs, (message) => { }))
      _cs.registerOnCreateError(_c2hhFn(_msgType.OnCreateError, _cs, (message) => { that.onBuildChannelError(message) }))
      _cs.registerOnWSClose(_c2hhFn(_msgType.OnWSClose, _cs, (message) => { that.onChannelFault(message) }))
      _cs.registerOnWSOpen(_c2hhFn(_msgType.OnWSOpen, _cs, (message) => { that.onFinishBuildChannel(message) }))

      chancel.active()
    } else if (chancel.type === ChancelType.nativeFork) {
      console.dir(chancel.server)
      _cs.registerOnGetServerMessage(_c2hhFn(_msgType.OnGetServerMessage, _cs, (message) => { that.onReceiveFromServer(message) }))
      _cs.registerOnSendMessageToServer(_c2hhFn(_msgType.OnSendMessageToServer, _cs, (message) => { that.onNoticeToServer(message) }))

      _cs.registerOnCreateError(_c2hhFn(_msgType.OnCreateError, _cs, (message) => { that.onBuildChannelError(message) }))
      _cs.registerOnRunning(_c2hhFn(_msgType.OnRunning, _cs, (message) => { that.onFinishBuildChannel(message) }))

      chancel.active()
    }

    that.__chancelList.push(chancel)
  },
  removeChancel: function (chancel) {
    var that = this
    var _c2hh = that.chancel2HandlerHelper
    var _c2hhFn = _c2hh.getThatFunctionList
    var _cs = chancel.server
    var _msgType = _cs.getInternalMessageType()

    if (chancel.type === ChancelType.websocketForNode ||
    chancel.type === ChancelType.websocketForPython
    ) {
      _.each(_c2hhFn(_msgType.OnWSGetServerMessage, _cs), function (fnc) {
        _cs.unregisterOnWSGetServerMessage(fnc)
      })
      _.each(_c2hhFn(_msgType.OnSendMessageToServer, _cs), function (fnc) {
        _cs.unregisterOnSendMessageToServer(fnc)
      })
      _.each(_c2hhFn(_msgType.OnCreateError, _cs), function (fnc) {
        _cs.unregisterOnCreateError(fnc)
      })
      _.each(_c2hhFn(_msgType.OnWSClose, _cs), function (fnc) {
        _cs.unregisterOnWSClose(fnc)
      })
      _.each(_c2hhFn(_msgType.OnWSOpen, _cs), function (fnc) {
        _cs.unregisterOnWSOpen(fnc)
      })
    } else if (chancel.type === ChancelType.nativeFork) {
      _.each(_c2hhFn(_msgType.OnGetServerMessage, _cs), function (fnc) {
        _cs.unregisterOnGetServerMessage(fnc)
      })
      _.each(_c2hhFn(_msgType.OnSendMessageToServer, _cs), function (fnc) {
        _cs.unregisterOnSendMessageToServer(fnc)
      })
      _.each(_c2hhFn(_msgType.OnCreateError, _cs), function (fnc) {
        _cs.unregisterOnCreateError(fnc)
      })
      _.each(_c2hhFn(_msgType.OnRunning, _cs), function (fnc) {
        _cs.unregisterOnRunning(fnc)
      })
    }
  },
  // -------------------------------------------------
  noticeToServer: function (message) {
    var that = this
    console.assert(this !== undefined, '[SDK] this !== undefined')

    if (that.__chancelList.length === 0) {
      console.warn(logCord, 'You maybe add one chancel')
    }

    _.each(that.__chancelList, function (chancel) {
      chancel.server.sendMessage(message)
    })
    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnNoticeToServer, message)
    return that
  },

  onReceiveFromServer: function (message) {
    var that = this
    console.assert(this !== undefined, '[SDK] this !== undefined')

    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnReceiveFromServer, message)
  },
  onStartBuildChannel: function (message) {
    var that = this
    console.assert(this !== undefined, '[SDK] this !== undefined')

    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnStartBuildChannel, message)
  },
  onBuildChannelError: function (message) {
    var that = this
    console.assert(this !== undefined, '[SDK] this !== undefined')

    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnBuildChannelError, message)
  },
  onFinishBuildChannel: function (message) {
    var that = this
    console.assert(this !== undefined, '[SDK] this !== undefined')

    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnFinishBuildChannel, message)
  },
  onChannelFault: function (message) {
    var that = this
    console.assert(this !== undefined, '[SDK] this !== undefined')

    that._traceLogEventsCount()
    that.mc.trigger(TypeMsg.OnChannelFault, message)
  }
}

// 批量处理注册及接收方式
_.each(TypeMsg, function (eventType, key, list) {
  var registerKey = 'register' + key
  var unregisterKey = 'unregister' + key

  __$p$[registerKey] = function (handler, one = false) {
    __$p$.mc.bind(eventType, handler, one)
  }
  __$p$[unregisterKey] = function (handler) {
    __$p$.mc.unbind(eventType, handler)
  }
})

var AgentClient = SelfClass.extend(__$p$)

//
// -----------------------------------------------
export {
  AgentClient
}

