import { GraphElements } from './canvas/visnetwork.common'
import { Node, Edge } from './canvas/visnetwork.godep'

export interface Request {
  pkgName: string
}

export interface Response extends GraphElements<Node, Edge> {
}