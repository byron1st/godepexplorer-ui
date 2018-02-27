import { ipcRenderer } from 'electron'
import * as IPCType from '../IPCTypes'
import { IStringSet } from '../GlobalTypes'

export function sendDepReq(pkgName: string) {
  ipcRenderer.send(IPCType.GetDepOfPkg.Request, pkgName)
}
