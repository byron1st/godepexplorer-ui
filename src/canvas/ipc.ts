import { ipcRenderer } from 'electron'
import * as constants from '../constants'
import * as godepvis from './visnetwork.godep'
import { Graph } from '../types'

const IPC = constants.IPC

export function initializeIPC () {
  ipcRenderer.on(IPC.GetInitDir.Response, (event: any, dirStruct: Graph) => {
    godepvis.default.updateGraph(dirStruct)
  })

  ipcRenderer.on(IPC.ExpandPkgStruct.Response, (event: any, pkgStruct: Graph) => {
    godepvis.default.addDepsToGraph(pkgStruct)
  })
}

export function sendExpandingReq (pkgName: string) {
  ipcRenderer.send(IPC.ExpandPkgStruct.Request, pkgName)
}

export function sendInfo (info: Graph) {
  ipcRenderer.send(IPC.ShowInfo.Send, info)
}

export function sendTestReq () {
  ipcRenderer.send(IPC.GetInitDir.Request, 'github.com/hyperledger/fabric/peer')
}
