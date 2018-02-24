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

export interface ListGraph {
  nodes: Node[]
  edges: Edge[]
}

export interface SetGraph {
  nodeSet: ElementSet<Node>
  edgeSet: ElementSet<Edge>
}

export interface ElementSet<T> {
  [id: string]: T
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
  funcSet: StringSet
}

interface EdgeMetaInfo {
  [key: string]: number | { [key: string]: boolean } | string
  type: EdgeType
  count: number
  depAtFunc: StringSet
  arrows?: 'to' | 'from' | 'middle'
}

interface StringSet {
  [key: string]: boolean
}

// Network-level type compositions (used by the controller module)
export interface Request { pkgName: string }
export interface Response extends ListGraph {}