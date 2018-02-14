import { ipcRenderer } from 'electron'
import * as constants from '../constants'
import * as godepvis from './visnetwork.godep'
import { GraphElements } from './visnetwork.common'

export function initializeIPC () {
  const IPC = constants.IPC

  ipcRenderer.on(IPC.GetInitDir.Response, (event: any, dirStruct: GraphElements<godepvis.Node, godepvis.Edge>) => {
    godepvis.default.updateGraph(dirStruct)
  })

  ipcRenderer.on(IPC.ExpandPkgStruct.Response, (event: any, pkgStruct: GraphElements<godepvis.Node, godepvis.Edge>) => {
    godepvis.default.addDepsToGraph(pkgStruct)
  })
}

export function sendExpandingReq (pkgName: string) {
  ipcRenderer.send(constants.IPC.ExpandPkgStruct.Request, pkgName)
}

export function sendTestReq () {
  ipcRenderer.send(constants.IPC.GetInitDir.Request, 'github.com/hyperledger/fabric/peer')
}
