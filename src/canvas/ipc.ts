import { ipcRenderer } from 'electron'
import * as IPCType from '../IPCTypes'
import { Graph } from '../GlobalTypes'
import { graphActions } from './actions'

export function sendDepReq (pkgName: string) {
  ipcRenderer.send(IPCType.GetDepOfPkg.Request, pkgName)
}
