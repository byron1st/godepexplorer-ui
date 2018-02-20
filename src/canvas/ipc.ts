import { ipcRenderer } from 'electron'
import * as constants from '../constants'
import GoDepVisNetwork from './visnetwork.godep'
import { Graph } from '../types'

const IPC = constants.IPC

export function initializeIPC (goDepVisNetwork: GoDepVisNetwork) {
  ipcRenderer.on(IPC.GetDepOfPkg.Response, (event: any, pkgStruct: Graph) => {
    goDepVisNetwork.addDepsToGraph(pkgStruct)
  })
}

export function sendDepReq (pkgName: string) {
  ipcRenderer.send(IPC.GetDepOfPkg.Request, pkgName)
}
