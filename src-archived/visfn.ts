import * as vis from 'vis'

export interface ResData {
  nodes: Node[]
  edges: Edge[]
}

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

let htmlVisnetwork: HTMLElement
let nodes: vis.DataSet<Node>, edges: vis.DataSet<Edge>, network: vis.Network

export function init (): { nodes: vis.DataSet<Node>, edges: vis.DataSet<Edge> } {
  nodes = new vis.DataSet([])
  edges = new vis.DataSet([])

  return { nodes, edges }
}

export function buildInitDirGraph (initData: ResData) {
  nodes.update(initData.nodes)
  edges.update(initData.edges)
}

export function addDepsToGraph (resData: ResData) {
  nodes.update(resData.nodes)
  edges.update(resData.edges.map(edge => {
    edge.arrows = 'to'
    return edge
  }))
}