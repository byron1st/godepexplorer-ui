import * as vis from 'vis'

export interface INode extends vis.Node {
  id: string
  isVisible: boolean
  meta: INodeMetaInfo
  ui: INodeUIInfo
}

export interface IEdge extends vis.Edge {
  id: string
  from: string
  to: string
  arrows?: 'to' | 'from' | 'middle' | any // optional type that is not defined in vis.Edge, but actually can be used.
  color?: any // http://visjs.org/docs/network/edges.html
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
}

interface IEdgeMetaInfo {
  [key: string]: number | { [id: string]: IDepAtFunc }
  type: EdgeType
  depAtFunc: { [id: string]: IDepAtFunc }
}

interface IDepAtFunc {
  id: string
  from: string
  to: string
}

interface INodeUIInfo {
  [key: string]: boolean | IStringSet
  isExpanded: boolean
  childrenEdgeIDSet: IStringSet
}

export interface IStringSet {
  [key: string]: boolean
}

// Network-level type compositions (used by the controller module)
export interface IRequest {
  pkgName: string
}

export interface IResponse {
  pkgName: string
  graph: IListGraph
}
