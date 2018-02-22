import * as React from 'react'
import { connect } from 'react-redux'
import * as vis from 'vis'
import * as ipc from '../../IPC'
import { Graph, Node, Edge, ElementSet } from '../../../GlobalTypes'
import { RootState } from '../../Reducers'

type VisNetworkProps = {
  elementSet: ElementSet
  compID: string
}

class VisNetwork extends React.Component<VisNetworkProps> {
  nodes: vis.DataSet<Node> = new vis.DataSet([])
  edges: vis.DataSet<Edge> = new vis.DataSet([])

  componentDidMount () {
    //@ts-ignore: 'document' is working well.
    const htmlElement: HTMLElement = document.getElementById(this.props.compID)
    this.initNetwork(htmlElement)
  }

  componentWillUpdate (nextProps: VisNetworkProps) {
    this.updateGraph({
      nodes: Object.values(nextProps.elementSet.nodeSet),
      edges: Object.values(nextProps.elementSet.edgeSet)
    })
  }

  initNetwork (htmlElement: HTMLElement) {
    const visnetwork = new vis.Network(htmlElement, { 
      nodes: this.nodes,
      edges: this.edges
    }, {})

    this.initEvent(visnetwork)
  }

  initEvent (visnetwork: vis.Network) {
    visnetwork.on('doubleClick', this.getDepsForPkg.bind(this))
    // visnetwork.on('click', this.showInfo.bind(this))
  }

  updateGraph (graph: Graph) {
    this.nodes.update(graph.nodes)
    this.edges.update(graph.edges.filter(edge => edge.meta.type === 0))
    this.edges.update(graph.edges.filter(edge => edge.meta.type === 1).map(edge => {
      edge.arrows = 'to'
      return edge
    }))
  }

  // resetGraph () {
  //   this.nodes.clear()
  //   this.edges.clear()
  // }

  getDepsForPkg (params: any) {
    if (params.nodes.length === 0) {
      return
    }
  
    const id: string = params.nodes[0]
    const pkg = this.nodes.get(id)
  
    ipc.sendDepReq(pkg.meta.packagePath)
  }

  render () {
    return ''
  }

  // showInfo (params: any) {
  //   const graph: Graph = {
  //     nodes: params.nodes.map((nodeId: string) => this.nodes.get(nodeId)),
  //     edges: params.edges.map((edgeId: string) => this.edges.get(edgeId))
  //   }

  //   if (graph.nodes.length !== 0 || graph.edges.length !== 0) {
  //     this.showInfoConn(graph)
  //   }
  // }
}

function mapStateToProps (state: RootState) {
  return {
    elementSet: state.graphState.elementSet
  }
}

export default connect(mapStateToProps)(VisNetwork)