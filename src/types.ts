export interface Request {
  pkgName: string
}

export interface Response extends GraphElements<Node, Edge> {
}

export interface GraphElements<N extends vis.Node, E extends vis.Edge> {
  nodes: N[]
  edges: E[]
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