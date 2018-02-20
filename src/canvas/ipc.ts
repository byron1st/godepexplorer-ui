import { ipcRenderer } from 'electron'
import * as constants from '../constants'
import GoDepVisNetwork from './visnetwork.godep'
import { Graph } from '../types'

const IPC = constants.IPC

export function initializeIPC (goDepVisNetwork: GoDepVisNetwork) {
  ipcRenderer.on(IPC.GetInitDir.Response, (event: any, dirStruct: Graph) => {
    goDepVisNetwork.updateGraph(dirStruct)
  })

  ipcRenderer.on(IPC.ExpandPkgStruct.Response, (event: any, pkgStruct: Graph) => {
    goDepVisNetwork.addDepsToGraph(pkgStruct)
  })
}

export function sendExpandingReq (pkgName: string) {
  ipcRenderer.send(IPC.ExpandPkgStruct.Request, pkgName)
}

export function sendInfo (info: Graph) {
  ipcRenderer.send(IPC.ShowInfo.Send, info)
}

export function sendGetInitDir (rootPath: string) {
  ipcRenderer.send(IPC.GetInitDir.Request, rootPath)
}

// export function sendTestReq () {
//   ipcRenderer.send(IPC.GetInitDir.Request, 'github.com/hyperledger/fabric/peer')
// }
