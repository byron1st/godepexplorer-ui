import * as React from 'react'
import { connect } from 'react-redux'
import * as vis from 'vis'
import * as ipc from '../../IPC'
import { ListGraph, Node, Edge, SetGraph, EdgeType } from '../../../GlobalTypes'
import { RootState } from '../../Reducers'
import { graphActions, uiActions } from '../../Actions'
import { filterNodeVisibility } from '../../util'

type VisNetworkProps = {
  elementSet: SetGraph
  compID: string
  selectionSet: SetGraph
  isStdVisible: boolean
  isExtVisible: boolean
  selectElement: (selectionSet: SetGraph) => any
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
      console.log(nextProps)
      this.updateGraph(nextProps)
      this.selectGraph(nextProps.selectionSet)
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

  updateGraph (nextProps: VisNetworkProps) {
    this.resetGraph()

    const graph = {
      nodes: Object.values(nextProps.elementSet.nodeSet),
      edges: Object.values(nextProps.elementSet.edgeSet)
    }
    this.nodes.update(graph.nodes.filter(node => filterNodeVisibility(node, nextProps.isStdVisible, nextProps.isExtVisible)))
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

  selectGraph (selectionSet: SetGraph) {
    if (this.visnetwork) {
      this.visnetwork.unselectAll()
      this.visnetwork.setSelection({
        nodes: Object.values(selectionSet.nodeSet).map(node => node.id),
        edges: Object.values(selectionSet.edgeSet).map(edge => edge.id)
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
    const selectionSet = {
      nodeSet: params.nodes.reduce((accumulated: { [id: string]: Node | Edge }, currentNodeId: string) => {
        accumulated[currentNodeId] = this.nodes.get(currentNodeId)
        return accumulated
      }, {}),
      edgeSet: params.edges.reduce((accumulated: { [id: string]: Node | Edge }, currentEdgeId: string) => {
        accumulated[currentEdgeId] = this.edges.get(currentEdgeId)
        return accumulated
      }, {})
    }

    if (Object.keys(selectionSet.nodeSet).length !== 0 || Object.keys(selectionSet.edgeSet).length !== 0) {
      this.props.selectElement(selectionSet)
    }
  }

  render () {
    return ''
  }
}

function isResetCommand (elementSet: SetGraph) {
  return Object.keys(elementSet.nodeSet).length === 0 && Object.keys(elementSet.edgeSet).length === 0
}

function mapStateToProps (state: RootState) {
  return {
    elementSet: state.graphState.elementSet,
    selectionSet: state.graphState.selectionSet,
    isStdVisible: state.uiState.isStdVisible,
    isExtVisible: state.uiState.isExtVisible
  }
}

function mapDispatchToProps (dispatch: any) {
  return {
    selectElement: (selectionSet: SetGraph) => {
      dispatch(graphActions.selectElement(selectionSet))
    },
    turnOnLoadingIndicator: (packagePath: string) => {
      dispatch(uiActions.turnOnLoadingIndicator(packagePath))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VisNetwork)