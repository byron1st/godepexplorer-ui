import * as vis from 'vis'
import * as ipc from './ipc'
import { Response } from '../protocol.external'

export interface Node extends vis.Node {
  id: string
  label: string
  packagePath: string
  packageName: string
  packageDir: string
  isPkg: boolean
  isExternal: boolean
  isStd: boolean
  funcSet: { [func: string]: boolean }
}

export interface Edge extends vis.Edge {
  id: string
  from: string
  to: string
  type: 0 | 1
  count: number
  depAtFunc: { [key: string]: boolean }
  arrows?: 'to' | 'from' | 'middle'
}

let nodes: vis.DataSet<Node> = new vis.DataSet([])
let edges: vis.DataSet<Edge> = new vis.DataSet([])

export function init (htmlElements: HTMLElement) {
  const visnetwork = new vis.Network(htmlElements, { nodes, edges }, {})

  visnetwork.on('doubleClick', getDepsForPkg)
  // visnetwork.on('click', showDetails)
}

export function buildInitDirGraph (initData: Response) {
  nodes.update(initData.nodes)
  edges.update(initData.edges)
}

export function addDepsToGraph (resData: Response) {
  nodes.update(resData.nodes)
  edges.update(resData.edges.map(edge => {
    edge.arrows = 'to'
    return edge
  }))
}

function getDepsForPkg (params: any) {
  if (params.nodes.length === 0) {
    return
  }

  const id: string = params.nodes[0]
  const pkg = nodes.get(id)

  ipc.sendExpandingReq(pkg.packagePath)
}