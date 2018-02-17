import * as common from './types.common'
import * as vis from 'vis'
import * as visTypes from './types.vis'

// Vis specific type compositions
export interface Node extends common.AbstractNode<visTypes.NodeMetaInfo> {}
export interface Edge extends common.AbstractEdge<visTypes.EdgeMetaInfo> {}
export interface Graph extends common.AbstractGraph<Node, Edge> {}

// Network-level type compositions (used by the controller module)
export interface Request { pkgName: string }
export interface Response extends Graph {}