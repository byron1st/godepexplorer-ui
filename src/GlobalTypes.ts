import * as vis from 'vis'

export interface Node extends vis.Node {
  id: string
  meta: NodeMetaInfo
}

export interface Edge extends vis.Edge {
  id: string
  from: string
  to: string
  arrows?: string // optional type that is not defined in vis.Edge, but actually can be used.
  meta: EdgeMetaInfo
}

export interface Graph {
  nodes: Node[]
  edges: Edge[]
}

export interface ElementSet {
  nodeSet: { [ID: string]: Node }
  edgeSet: { [ID: string]: Edge }
}

export enum EdgeType {
  COMP = 0,
  REL
}

interface NodeMetaInfo {
  [key: string]: string | boolean | { [func: string]: boolean }
  packagePath: string
  packageName: string
  packageDir: string
  isPkg: boolean
  isExternal: boolean
  isStd: boolean
  funcSet: { [func: string]: boolean }
}

interface EdgeMetaInfo {
  [key: string]: number | { [key: string]: boolean } | string
  type: EdgeType
  count: number
  depAtFunc: { [key: string]: boolean }
  arrows?: 'to' | 'from' | 'middle'
}

// Network-level type compositions (used by the controller module)
export interface Request { pkgName: string }
export interface Response extends Graph {}