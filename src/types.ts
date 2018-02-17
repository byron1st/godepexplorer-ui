import * as vis from 'vis'

export interface Node extends vis.Node {
  meta: NodeMetaInfo
}

export interface Edge extends vis.Edge {
  meta: EdgeMetaInfo
}

export interface Graph {
  nodes: Node[]
  edges: Edge[]
}

interface NodeMetaInfo {
  packagePath: string
  packageName: string
  packageDir: string
  isPkg: boolean
  isExternal: boolean
  isStd: boolean
  funcSet: { [func: string]: boolean }
}

interface EdgeMetaInfo {
  type: 0 | 1
  count: number
  depAtFunc: { [key: string]: boolean }
  arrows?: 'to' | 'from' | 'middle'
}

// Network-level type compositions (used by the controller module)
export interface Request { pkgName: string }
export interface Response extends Graph {}