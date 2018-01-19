import * as vis from 'vis'

export interface ResData {
  nodes: Node[]
  edges: Edge[]
}

interface Node {
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

interface Edge {
  id: string
  from: string
  to: string
  type: 0 | 1
  count: number
  depAtFunc: { [key: string]: boolean }
}

let htmlVisnetwork: HTMLElement
let nodes: vis.DataSet<vis.Node>, edges: vis.DataSet<vis.Edge>, network: vis.Network

export function init (visnetwork: HTMLElement) {
  htmlVisnetwork = visnetwork
  nodes = new vis.DataSet([])
  edges = new vis.DataSet([])
  network = new vis.Network(htmlVisnetwork, { nodes, edges }, {})
}

export function buildInitDirGraph (initData: ResData) {
  nodes.update(initData.nodes)
  edges.update(initData.edges)
}

export function addDepsToGraph (resData: ResData) {

}