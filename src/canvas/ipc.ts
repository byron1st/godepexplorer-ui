import { ipcRenderer } from 'electron'
import * as constants from '../constants'
import * as vis from './visnetwork'

const VisNetworkComp = 'vis-canvas'

export function initializeIPC () {
  const IPC = constants.IPC

  ipcRenderer.on(IPC.GetInitDir.Response, (event: any, dirStructure: any) => {
    // TODO: do something.
    console.log(dirStructure)
    vis.buildInitDirGraph(dirStructure)
  })
}

export function sendTestReq () {
  ipcRenderer.send(constants.IPC.GetInitDir.Request, {pkgName: 'github.com/hyperledger/fabric/peer'})
}
