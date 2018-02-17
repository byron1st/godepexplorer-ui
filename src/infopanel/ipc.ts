import { ipcRenderer } from 'electron'
import * as constants from '../constants'
import { GraphElements, Node, Edge } from '../types'

const IPC = constants.IPC

export function initializeIPC (update: (graphElements: GraphElements<Node, Edge>) => void) {
  ipcRenderer.on(IPC.ShowInfo.Receive, (event: any, graphElements: GraphElements<Node, Edge>) => {
    update(graphElements)
  })
}
