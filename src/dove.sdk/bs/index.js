import _ from 'lodash'

import { common } from './common'
import { iap } from './iap'
import { notice } from './notice'
import { app } from './app'
import { xpc } from './xpc'
import { window } from './window'
import { menu } from './menu'
import { clipboard } from './clipboard'
import { dock } from './dock'
import { binary } from './binary'
import { plugin } from './plugin'
import { dragdrop } from './dragdrop'
import { task } from './task'
import { filedialog } from './filedialog'
import { AgentClient } from './agent.client'
import { AgentServer } from './agent.server'

// ---------------------------
// Interface outside
var $bc_ = {}
$bc_ = _.extend($bc_, common)
$bc_ = _.extend($bc_, iap)
$bc_ = _.extend($bc_, notice)
$bc_ = _.extend($bc_, app)
$bc_ = _.extend($bc_, xpc)
$bc_ = _.extend($bc_, window)
$bc_ = _.extend($bc_, menu)
$bc_ = _.extend($bc_, clipboard)
$bc_ = _.extend($bc_, dock)
$bc_ = _.extend($bc_, binary)
$bc_ = _.extend($bc_, plugin)
$bc_ = _.extend($bc_, dragdrop)
$bc_ = _.extend($bc_, task)
$bc_ = _.extend($bc_, filedialog)
$bc_ = _.extend($bc_, { AgentClient: AgentClient })
$bc_ = _.extend($bc_, { AgentServer: AgentServer })

export default {
  version: '__VERSION__',
  b$: $bc_
}

