import { ipcRenderer } from 'electron'
import * as IPCType from '../IPCTypes'
import { Graph } from '../GlobalTypes'

export function initializeIPC () {
  ipcRenderer.on(IPCType.GetDepOfPkg.Response, (event: any, pkgStruct: Graph) => {
    // TODO: dispatch action.
  })
}

export function sendDepReq (pkgName: string) {
  ipcRenderer.send(IPCType.GetDepOfPkg.Request, pkgName)
}
