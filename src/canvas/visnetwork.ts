import * as vis from 'vis'

interface ResData {
  nodes: Node[]
  edges: Edge[]
}

interface Node extends vis.Node {
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

interface Edge extends vis.Edge {
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

  // visnetwork.on('doubleClick', getDepsForPkg)
  // visnetwork.on('click', showDetails)
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