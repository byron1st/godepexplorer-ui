import { ipcRenderer } from 'electron'
import * as constants from '../constants'
import { Graph, Node, Edge } from '../types'

const IPC = constants.IPC

export function initializeIPC (update: (graph: Graph) => void) {
  ipcRenderer.on(IPC.ShowInfo.Receive, (event: any, graph: Graph) => {
    update(graph)
  })
}
