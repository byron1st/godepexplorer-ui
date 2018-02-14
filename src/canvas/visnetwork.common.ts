import * as vis from 'vis'

export interface GraphElements<N extends vis.Node, E extends vis.Edge> {
  nodes: N[]
  edges: E[]
}

// Every functions defined in every child class should be defined as an arrow function
// because of `this` binding problem.
export abstract class VisNetwork<N extends vis.Node, E extends vis.Edge> {
  nodes: vis.DataSet<N> = new vis.DataSet([])
  edges: vis.DataSet<E> = new vis.DataSet([])

  init (htmlElements: HTMLElement) {
    const visnetwork = new vis.Network(htmlElements, { 
      nodes: this.nodes,
      edges: this.edges
    }, {})

    this.initNetwork(visnetwork)
  }

  updateGraph (data: GraphElements<N, E>) {
    this.nodes.update(data.nodes)
    this.edges.update(data.edges)
  }

  abstract initNetwork (visnetwork: vis.Network): void
}