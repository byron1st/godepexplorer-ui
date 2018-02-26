import { ipcRenderer } from 'electron'
import * as IPCType from '../IPCTypes'
import { IStringSet } from '../GlobalTypes'

export function sendDepReq(
  pkgName: string,
  isNewlyAdded: boolean,
  funcSet: IStringSet
) {
  ipcRenderer.send(IPCType.GetDepOfPkg.Request, pkgName, isNewlyAdded, funcSet)
}
