import { ipcRenderer } from 'electron'
import * as constants from '../constants'
import * as vis from './visnetwork'
import * as protocol from '../protocol.external'

export function initializeIPC () {
  const IPC = constants.IPC

  ipcRenderer.on(IPC.GetInitDir.Response, (event: any, dirStruct: protocol.Response) => {
    vis.buildInitDirGraph(dirStruct)
  })

  ipcRenderer.on(IPC.ExpandPkgStruct.Response, (event: any, pkgStruct: protocol.Response) => {
    vis.addDepsToGraph(pkgStruct)
  })
}

export function sendExpandingReq (pkgName: string) {
  ipcRenderer.send(constants.IPC.ExpandPkgStruct.Request, pkgName)
}

export function sendTestReq () {
  ipcRenderer.send(constants.IPC.GetInitDir.Request, 'github.com/hyperledger/fabric/peer')
}
