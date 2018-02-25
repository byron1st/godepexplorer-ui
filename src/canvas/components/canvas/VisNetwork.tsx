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
  visGraphSet: SetGraph = { nodeSet: {}, edgeSet: {} }

  componentDidMount() {
    //@ts-ignore: 'document' is working well.
    const htmlElement: HTMLElement = document.getElementById(this.props.compID)
    this.initNetwork(htmlElement)
  }

  componentWillUpdate(nextProps: VisNetworkProps) {
    if (isResetCommand(nextProps.elementSet)) {
      this.resetGraph()
    } else {
      this.updateGraph(nextProps)
      this.selectGraph(nextProps)
    }
  }

  initNetwork(htmlElement: HTMLElement) {
    this.visnetwork = new vis.Network(
      htmlElement,
      {
        nodes: this.nodes,
        edges: this.edges
      },
      {}
    )

    this.visnetwork.on('doubleClick', this.getDepsForPkg.bind(this))
    this.visnetwork.on('click', this.showInfo.bind(this))
  }

  updateGraph(nextProps: VisNetworkProps) {
    // first remove nodes which become invisible.
    this.nodes.forEach((node, nodeId) => {
      if (
        !filterNodeVisibility(
          nextProps.elementSet.nodeSet[nodeId],
          nextProps.isStdVisible,
          nextProps.isExtVisible
        )
      ) {
        this.nodes.remove(nodeId)
      }
    })

    const newNodes = Object.values(nextProps.elementSet.nodeSet)
    const newEdges = Object.values(nextProps.elementSet.edgeSet)
    // then add all visible nodes from new elementSet.
    this.nodes.update(
      newNodes.filter(node =>
        filterNodeVisibility(
          node,
          nextProps.isStdVisible,
          nextProps.isExtVisible
        )
      )
    )

    this.edges.update(newEdges.filter(edge => edge.meta.type === EdgeType.COMP))
    this.edges.update(
      newEdges.filter(edge => edge.meta.type === EdgeType.REL).map(edge => {
        edge.arrows = 'to'
        return edge
      })
    )
  }

  resetGraph() {
    this.nodes.clear()
    this.edges.clear()
  }

  selectGraph(nextProps: VisNetworkProps) {
    if (this.visnetwork) {
      this.visnetwork.unselectAll()

      this.visnetwork.setSelection({
        nodes: Object.values(nextProps.selectionSet.nodeSet)
          .filter(node => {
            const result = filterNodeVisibility(
              nextProps.elementSet.nodeSet[node.id],
              nextProps.isStdVisible,
              nextProps.isExtVisible
            )
            return result
          })
          .map(node => node.id),
        edges: Object.values(nextProps.selectionSet.edgeSet)
          .filter(
            edge =>
              filterNodeVisibility(
                nextProps.elementSet.nodeSet[edge.from],
                nextProps.isStdVisible,
                nextProps.isExtVisible
              ) &&
              filterNodeVisibility(
                nextProps.elementSet.nodeSet[edge.to],
                nextProps.isStdVisible,
                nextProps.isExtVisible
              )
          )
          .map(edge => edge.id)
      })
    }
  }

  getDepsForPkg(params: any) {
    if (params.nodes.length === 0) {
      return
    }

    const id: string = params.nodes[0]
    const pkg = this.nodes.get(id)

    this.props.turnOnLoadingIndicator(pkg.meta.packagePath)
    ipc.sendDepReq(pkg.meta.packagePath)
  }

  showInfo(params: any) {
    const selectionSet = {
      nodeSet: params.nodes.reduce(
        (accumulated: { [id: string]: Node | Edge }, currentNodeId: string) => {
          accumulated[currentNodeId] = this.nodes.get(currentNodeId)
          return accumulated
        },
        {}
      ),
      edgeSet: params.edges.reduce(
        (accumulated: { [id: string]: Node | Edge }, currentEdgeId: string) => {
          accumulated[currentEdgeId] = this.edges.get(currentEdgeId)
          return accumulated
        },
        {}
      )
    }

    if (
      Object.keys(selectionSet.nodeSet).length !== 0 ||
      Object.keys(selectionSet.edgeSet).length !== 0
    ) {
      this.props.selectElement(selectionSet)
    }
  }

  render() {
    return ''
  }
}

function isResetCommand(elementSet: SetGraph) {
  return (
    Object.keys(elementSet.nodeSet).length === 0 &&
    Object.keys(elementSet.edgeSet).length === 0
  )
}

function mapStateToProps(state: RootState) {
  return {
    elementSet: state.graphState.elementSet,
    selectionSet: state.graphState.selectionSet,
    isStdVisible: state.uiState.isStdVisible,
    isExtVisible: state.uiState.isExtVisible
  }
}

function mapDispatchToProps(dispatch: any) {
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
