import * as vis from 'vis'

export interface INode extends vis.Node {
  id: string
  isVisible: boolean
  meta: INodeMetaInfo
}

export interface IEdge extends vis.Edge {
  id: string
  from: string
  to: string
  arrows?: string // optional type that is not defined in vis.Edge, but actually can be used.
  meta: IEdgeMetaInfo
}

export interface IListGraph {
  nodes: INode[]
  edges: IEdge[]
}

export interface ISetGraph {
  nodeSet: IElementSet<INode>
  edgeSet: IElementSet<IEdge>
}

export interface IElementSet<T> {
  [id: string]: T
}

export enum EdgeType {
  COMP = 0,
  REL
}

interface INodeMetaInfo {
  [key: string]: string | boolean | { [func: string]: boolean }
  packagePath: string
  packageName: string
  packageDir: string
  isPkg: boolean
  isExternal: boolean
  isStd: boolean
  funcSet: IStringSet
}

interface IEdgeMetaInfo {
  [key: string]: number | { [key: string]: boolean } | string
  type: EdgeType
  count: number
  depAtFunc: IStringSet
  arrows?: 'to' | 'from' | 'middle'
}

interface IStringSet {
  [key: string]: boolean
}

// Network-level type compositions (used by the controller module)
export interface IRequest {
  pkgName: string
}
