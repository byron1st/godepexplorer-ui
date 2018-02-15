import { ipcRenderer } from 'electron'
import * as constants from '../constants'
import * as godepvis from './visnetwork.godep'
import { GraphElements } from './visnetwork.common'

const IPC = constants.IPC

export function initializeIPC () {
  ipcRenderer.on(IPC.GetInitDir.Response, (event: any, dirStruct: GraphElements<godepvis.Node, godepvis.Edge>) => {
    godepvis.default.updateGraph(dirStruct)
  })

  ipcRenderer.on(IPC.ExpandPkgStruct.Response, (event: any, pkgStruct: GraphElements<godepvis.Node, godepvis.Edge>) => {
    godepvis.default.addDepsToGraph(pkgStruct)
  })
}

export function sendExpandingReq (pkgName: string) {
  ipcRenderer.send(IPC.ExpandPkgStruct.Request, pkgName)
}

export function sendInfo (info: godepvis.Node[] | godepvis.Edge[]) {
  ipcRenderer.send(IPC.ShowInfo.Send, info)
}

export function sendTestReq () {
  ipcRenderer.send(IPC.GetInitDir.Request, 'github.com/hyperledger/fabric/peer')
}
