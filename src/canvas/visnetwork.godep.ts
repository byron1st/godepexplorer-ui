import * as vis from 'vis'
import * as ipc from './ipc'
import { Graph, Node, Edge } from '../types'

class GoDepVisNetwork {
  nodes: vis.DataSet<Node> = new vis.DataSet([])
  edges: vis.DataSet<Edge> = new vis.DataSet([])

  initNetwork (htmlElements: HTMLElement) {
    const visnetwork = new vis.Network(htmlElements, { 
      nodes: this.nodes,
      edges: this.edges
    }, {})

    this.initEvent(visnetwork)
  }

  updateGraph (graph: Graph) {
    this.nodes.update(graph.nodes)
    this.edges.update(graph.edges)
  }

  initEvent (visnetwork: vis.Network) {
    visnetwork.on('doubleClick', this.getDepsForPkg.bind(this))
    visnetwork.on('click', this.showInfo.bind(this))
  }

  getDepsForPkg (params: any) {
    if (params.nodes.length === 0) {
      return
    }
  
    const id: string = params.nodes[0]
    const pkg = this.nodes.get(id)
  
    ipc.sendExpandingReq(pkg.meta.packagePath)
  }

  showInfo (params: any) {
    let info: Graph = {
      nodes: params.nodes.map((nodeId: string) => this.nodes.get(nodeId)),
      edges: params.edges.map((edgeId: string) => this.edges.get(edgeId))
    }

    if (info.nodes.length !== 0 || info.edges.length !== 0) {
      ipc.sendInfo(info)
    }
  }

  addDepsToGraph = (resData: Graph) => {
    this.nodes.update(resData.nodes)
    this.edges.update(resData.edges.map(edge => {
      edge.arrows = 'to'
      return edge
    }))
  }

}

export default new GoDepVisNetwork()