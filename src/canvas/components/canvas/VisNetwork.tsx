import * as React from 'react'
import { connect } from 'react-redux'
import * as vis from 'vis'
import * as ipc from '../../IPC'
import { Graph, Node, Edge, ElementSet, EdgeType } from '../../../GlobalTypes'
import { RootState } from '../../Reducers'
import { graphActions, uiActions } from '../../Actions'

type VisNetworkProps = {
  elementSet: ElementSet
  compID: string
  selections: Graph
  selectElement: (selectedGraph: Graph) => any
  turnOnLoadingIndicator: (packagePath: string) => any
}

class VisNetwork extends React.Component<VisNetworkProps> {
  nodes: vis.DataSet<Node> = new vis.DataSet([])
  edges: vis.DataSet<Edge> = new vis.DataSet([])
  visnetwork: vis.Network

  componentDidMount () {
    //@ts-ignore: 'document' is working well.
    const htmlElement: HTMLElement = document.getElementById(this.props.compID)
    this.initNetwork(htmlElement)
  }

  componentWillUpdate (nextProps: VisNetworkProps) {
    if (isResetCommand(nextProps.elementSet)) {
      this.resetGraph()
    } else {
      this.updateGraph({
        nodes: Object.values(nextProps.elementSet.nodeSet),
        edges: Object.values(nextProps.elementSet.edgeSet)
      })
    }
  }

  initNetwork (htmlElement: HTMLElement) {
    this.visnetwork = new vis.Network(htmlElement, { 
      nodes: this.nodes,
      edges: this.edges
    }, {})

    this.visnetwork.on('doubleClick', this.getDepsForPkg.bind(this))
    this.visnetwork.on('click', this.showInfo.bind(this))
  }

  updateGraph (graph: Graph) {
    this.nodes.update(graph.nodes)
    this.edges.update(graph.edges.filter(edge => edge.meta.type === EdgeType.COMP))
    this.edges.update(graph.edges.filter(edge => edge.meta.type === EdgeType.REL).map(edge => {
      edge.arrows = 'to'
      return edge
    }))
  }

  resetGraph () {
    this.nodes.clear()
    this.edges.clear()
  }

  selectGraph (selections: Graph) {
    if (this.visnetwork) {
      this.visnetwork.unselectAll()
      this.visnetwork.setSelection({
        nodes: selections.nodes.map(node => node.id),
        edges: selections.edges.map(edge => edge.id)
      })
    }
  }

  getDepsForPkg (params: any) {
    if (params.nodes.length === 0) {
      return
    }
  
    const id: string = params.nodes[0]
    const pkg = this.nodes.get(id)

    this.props.turnOnLoadingIndicator(pkg.meta.packagePath)
    ipc.sendDepReq(pkg.meta.packagePath)
  }

  showInfo (params: any) {
    const graph: Graph = {
      nodes: params.nodes.map((nodeId: string) => this.nodes.get(nodeId)),
      edges: params.edges.map((edgeId: string) => this.edges.get(edgeId))
    }

    if (graph.nodes.length !== 0 || graph.edges.length !== 0) {
      this.props.selectElement(graph)
    }
  }

  render () {
    return ''
  }
}

function isResetCommand (elementSet: ElementSet) {
  return Object.keys(elementSet.nodeSet).length === 0 && Object.keys(elementSet.edgeSet).length === 0
}

function mapStateToProps (state: RootState) {
  return {
    elementSet: state.graphState.elementSet,
    selections: state.graphState.selections
  }
}

function mapDispatchToProps (dispatch: any) {
  return {
    selectElement: (selectedGraph: Graph) => {
      dispatch(graphActions.selectElement(selectedGraph))
    },
    turnOnLoadingIndicator: (packagePath: string) => {
      dispatch(uiActions.turnOnLoadingIndicator(packagePath))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VisNetwork)