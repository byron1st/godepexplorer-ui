export interface AbstractGraph<Node, Edge> {
  nodes: Node[]
  edges: Edge[]
}

export interface AbstractNode<K> {
  meta: K
}

export interface AbstractEdge<K> {
  meta: K
}