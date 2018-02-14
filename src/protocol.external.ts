import { Node, Edge } from './canvas/visnetwork'

export interface Request {
  pkgName: string
}

export interface Response {
  nodes: Node[]
  edges: Edge[]
}