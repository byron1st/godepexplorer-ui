import * as vis from 'vis'

export interface ResData {
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

let htmlVisnetwork: HTMLElement
let nodes: vis.DataSet<vis.Node>, edges: vis.DataSet<vis.Edge>, network: vis.Network

export function init (visnetwork: HTMLElement, getDepsForPkg: (pkgName: string) => void) {
  htmlVisnetwork = visnetwork
  nodes = new vis.DataSet([])
  edges = new vis.DataSet([])
  network = new vis.Network(htmlVisnetwork, { nodes, edges }, {})

  network.on('doubleClick', (params) => {
    if (params.nodes.length > 0) {
      const id: string = params.nodes[0]
      const pkg = nodes.get(id) as Node
      getDepsForPkg(pkg.packagePath)
    }
  })
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