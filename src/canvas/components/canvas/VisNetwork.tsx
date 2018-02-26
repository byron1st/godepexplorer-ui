import * as React from 'react'
import { connect } from 'react-redux'
import * as vis from 'vis'
import {
  EdgeType,
  IEdge,
  IListGraph,
  INode,
  ISetGraph
} from '../../../GlobalTypes'
import { graphActions, uiActions } from '../../Actions'
import * as ipc from '../../IPC'
import { IRootState } from '../../Reducers'
import { filterNodeVisibility } from '../../util'

interface IVisNetworkProps {
  elementSet: ISetGraph
  compID: string
  selectionSet: ISetGraph
  isStdVisible: boolean
  isExtVisible: boolean
  selectElement: (selectionSet: ISetGraph) => any
  turnOnLoadingIndicator: (packagePath: string) => any
}

class VisNetwork extends React.Component<IVisNetworkProps> {
  private nodes: vis.DataSet<INode> = new vis.DataSet([])
  private edges: vis.DataSet<IEdge> = new vis.DataSet([])
  private visnetwork: vis.Network
  private visGraphSet: ISetGraph = { nodeSet: {}, edgeSet: {} }

  public componentDidMount() {
    // @ts-ignore: 'document' is working well.
    const htmlElement: HTMLElement = document.getElementById(this.props.compID)
    this.initNetwork(htmlElement)
  }

  public componentWillUpdate(nextProps: IVisNetworkProps) {
    if (isResetCommand(nextProps.elementSet)) {
      this.resetGraph()
    } else {
      this.updateGraph(nextProps)
      this.selectGraph(nextProps)
    }
  }

  public render() {
    return ''
  }

  private initNetwork(htmlElement: HTMLElement) {
    this.visnetwork = new vis.Network(
      htmlElement,
      {
        edges: this.edges,
        nodes: this.nodes
      },
      {}
    )

    this.visnetwork.on('doubleClick', this.getDepsForPkg.bind(this))
    this.visnetwork.on('click', this.showInfo.bind(this))
  }

  private updateGraph(nextProps: IVisNetworkProps) {
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

  private resetGraph() {
    this.nodes.clear()
    this.edges.clear()
  }

  private selectGraph(nextProps: IVisNetworkProps) {
    if (this.visnetwork) {
      this.visnetwork.unselectAll()

      this.visnetwork.setSelection({
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
          .map(edge => edge.id),
        nodes: Object.values(nextProps.selectionSet.nodeSet)
          .filter(node => {
            const result = filterNodeVisibility(
              nextProps.elementSet.nodeSet[node.id],
              nextProps.isStdVisible,
              nextProps.isExtVisible
            )
            return result
          })
          .map(node => node.id)
      })
    }
  }

  private getDepsForPkg(params: any) {
    if (params.nodes.length === 0) {
      return
    }

    const id: string = params.nodes[0]
    const pkg = this.nodes.get(id)

    this.props.turnOnLoadingIndicator(pkg.meta.packagePath)
    ipc.sendDepReq(pkg.meta.packagePath, false, pkg.meta.funcSet)
  }

  private showInfo(params: any) {
    const selectionSet = {
      edgeSet: params.edges.reduce(
        (
          accumulated: { [id: string]: INode | IEdge },
          currentEdgeId: string
        ) => {
          accumulated[currentEdgeId] = this.edges.get(currentEdgeId)
          return accumulated
        },
        {}
      ),
      nodeSet: params.nodes.reduce(
        (
          accumulated: { [id: string]: INode | IEdge },
          currentNodeId: string
        ) => {
          accumulated[currentNodeId] = this.nodes.get(currentNodeId)
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
}

function isResetCommand(elementSet: ISetGraph) {
  return (
    Object.keys(elementSet.nodeSet).length === 0 &&
    Object.keys(elementSet.edgeSet).length === 0
  )
}

function mapStateToProps(state: IRootState) {
  return {
    elementSet: state.graphState.elementSet,
    isExtVisible: state.uiState.isExtVisible,
    isStdVisible: state.uiState.isStdVisible,
    selectionSet: state.graphState.selectionSet
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    selectElement: (selectionSet: ISetGraph) => {
      dispatch(graphActions.selectElement(selectionSet))
    },
    turnOnLoadingIndicator: (packagePath: string) => {
      dispatch(uiActions.turnOnLoadingIndicator(packagePath))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VisNetwork)
