import { ipcRenderer } from 'electron'
import * as constants from '../constants'
import * as godepvis from './visnetwork.godep'
import { GraphElements, Node, Edge } from '../types'

const IPC = constants.IPC

export function initializeIPC () {
  ipcRenderer.on(IPC.GetInitDir.Response, (event: any, dirStruct: GraphElements<Node, Edge>) => {
    godepvis.default.updateGraph(dirStruct)
  })

  ipcRenderer.on(IPC.ExpandPkgStruct.Response, (event: any, pkgStruct: GraphElements<Node, Edge>) => {
    godepvis.default.addDepsToGraph(pkgStruct)
  })
}

export function sendExpandingReq (pkgName: string) {
  ipcRenderer.send(IPC.ExpandPkgStruct.Request, pkgName)
}

export function sendInfo (info: GraphElements<Node, Edge>) {
  ipcRenderer.send(IPC.ShowInfo.Send, info)
}

export function sendTestReq () {
  ipcRenderer.send(IPC.GetInitDir.Request, 'github.com/hyperledger/fabric/peer')
}
