import * as _ from 'lodash'
import * as Type from './Type'
import { ISideBarTypeData, ISideBarListItemData } from '../reducers/Type'

interface IElementSet<T> {
  [id: string]: T
}

export interface IGraphDataSet {
  nodeSet: IElementSet<Type.INode>
  edgeSet: IElementSet<Type.IEdge>
}

class DataSet {
  private dataSet: IGraphDataSet = { nodeSet: {}, edgeSet: {} }

  public addGraph(graph: Type.IListGraph, ignoreStd: boolean) {
    graph.nodes.forEach(node => {
      const existingNode = this.dataSet.nodeSet[node.id]
      if (existingNode) {
        this.dataSet.nodeSet[node.id] = this.resolveNode(existingNode, node)
      } else {
        node.isVisible = !ignoreStd || node.type !== Type.PkgType.STD
        this.dataSet.nodeSet[node.id] = node
      }
    })

    graph.edges.forEach(edge => {
      const existingEdge = this.dataSet.edgeSet[edge.id]
      this.dataSet.edgeSet[edge.id] = existingEdge
        ? this.resolveEdge(existingEdge, edge)
        : edge
    })
  }

  public getSideBarTypeData(
    currentState: ISideBarTypeData,
    ignoreStd: boolean
  ): ISideBarTypeData {
    const newState = _.cloneDeep(currentState)
    _.keys(this.dataSet.nodeSet).forEach((nodeID: string) => {
      if (
        !_.includes(currentState.visibleList, nodeID) &&
        !_.includes(currentState.invisibleList, nodeID)
      ) {
        if (ignoreStd && this.getNode(nodeID).type === Type.PkgType.STD) {
          newState.invisibleList.push(nodeID)
        } else {
          newState.visibleList.push(nodeID)
        }
      }
    })

    newState.visibleList.sort(this.sortByPkgPath.bind(this))
    newState.invisibleList.sort(this.sortByPkgPath.bind(this))
    return newState
  }

  public getNode(id: string) {
    return this.dataSet.nodeSet[id]
  }

  public getEdge(id: string) {
    return this.dataSet.edgeSet[id]
  }

  public selectNode(id: string) {
    return {
      nodeList: [id],
      edgeList: Object.values(this.dataSet.edgeSet)
        .filter(edge => edge.from === id || edge.to === id)
        .map(edge => edge.id)
    }
  }

  public getSideBarListData(): ISideBarListItemData[] {
    return _.values(this.dataSet.nodeSet).map(node => ({
      id: node.id,
      type: node.type as Type.PkgType,
      label: node.label,
      path: node.meta.pkgPath,
      isVisible: node.isVisible
    }))
  }

  public getVisibleNodeIDList(): string[] {
    return _.keys(this.dataSet.nodeSet).filter(id => this.getNode(id).isVisible)
  }

  public getVisibleElements(nodeIDList: string[]) {
    const nodeList: Type.INode[] = nodeIDList.map(nodeID =>
      this.getNode(nodeID)
    )

    const edgeList: Type.IEdge[] = Object.values(this.dataSet.edgeSet).filter(
      edge => nodeIDList.includes(edge.from) && nodeIDList.includes(edge.to)
    )

    return { nodeList, edgeList }
  }

  public show(id: string) {
    this.getNode(id).isVisible = true
  }

  public hide(id: string) {
    this.getNode(id).isVisible = false
  }

  private resolveNode(
    existingNode: Type.INode,
    currentNode: Type.INode
  ): Type.INode {
    const updatedNode = _.cloneDeep(existingNode)
    // Type이 EXT 일 경우 NOR로 변경
    if (
      updatedNode.type === Type.PkgType.EXT &&
      currentNode.type === Type.PkgType.NOR
    ) {
      updatedNode.type = Type.PkgType.NOR
      updatedNode.meta.pkgType = Type.PkgType.NOR
    }

    // sinkEdgeIDSet 병합
    _.keys(currentNode.meta.sinkEdgeIDSet).forEach((edgeID: string) => {
      updatedNode.meta.sinkEdgeIDSet[edgeID] = true
    })

    // sourceEdgeIDSet 병합
    _.keys(currentNode.meta.sourceEdgeIDSet).forEach((edgeID: string) => {
      updatedNode.meta.sourceEdgeIDSet[edgeID] = true
    })

    return updatedNode
  }

  private resolveEdge(
    existingEdge: Type.IEdge,
    currentEdge: Type.IEdge
  ): Type.IEdge {
    const updatedEdge = _.cloneDeep(existingEdge)

    // depAtFuncSet 병합
    _.keys(currentEdge.meta.depAtFuncSet).forEach((id: string) => {
      updatedEdge.meta.depAtFuncSet[id] = currentEdge.meta.depAtFuncSet[id]
    })

    return updatedEdge
  }

  private sortByPkgPath(prev: string, next: string) {
    if (this.getNode(prev).meta.pkgPath <= this.getNode(next).meta.pkgPath) {
      return -1
    } else {
      return 1
    }
  }
}

export default new DataSet()
