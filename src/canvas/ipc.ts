import { ipcRenderer } from 'electron'
import * as constants from '../constants'
import * as vis from './visnetwork'

export function initializeIPC () {
  const IPC = constants.IPC

  ipcRenderer.on(IPC.GetInitDir.Response, (event: any, dirStruct: vis.GraphElements) => {
    vis.buildInitDirGraph(dirStruct)
  })

  ipcRenderer.on(IPC.ExpandPkgStruct.Response, (event: any, pkgStruct: vis.GraphElements) => {
    vis.addDepsToGraph(pkgStruct)
  })
}

export function sendExpandingReq (pkgName: string) {
  ipcRenderer.send(constants.IPC.ExpandPkgStruct.Request, pkgName)
}

export function sendTestReq () {
  ipcRenderer.send(constants.IPC.GetInitDir.Request, 'github.com/hyperledger/fabric/peer')
}
