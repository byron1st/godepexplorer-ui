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

export function init (visnetwork: HTMLElement) {
  htmlVisnetwork = visnetwork
}

export function buildInitDirGraph (initData: ResData) {
  const nodes = new vis.DataSet(initData.nodes)
  const edges = new vis.DataSet(initData.edges)
  const network = new vis.Network(htmlVisnetwork, initData, { layout: { improvedLayout: false }})
}

export function addDepsToGraph (resData: ResData) {
  
}