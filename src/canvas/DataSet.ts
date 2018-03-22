import { IGraphDataSet, Graph, State } from 'godeptypes'
import { PkgType } from './enums'

const INITIAL_SIDEBARDATA: State.ISideBarData = {
  nor: {
    visibleList: [],
    invisibleList: []
  },
  ext: {
    visibleList: [],
    invisibleList: []
  },
  std: {
    visibleList: [],
    invisibleList: []
  }
}

class DataSet {
  private dataSet: IGraphDataSet = { nodeSet: {}, edgeSet: {} }

  public init(graph: Graph.IListGraph) {
    const sideBarState: State.ISideBarData = INITIAL_SIDEBARDATA

    graph.nodes.forEach(node => {
      this.dataSet.nodeSet[node.id] = node
      dispatchIDToList(sideBarState, node.meta.pkgType, node.id)
    })

    graph.edges.forEach(edge => (this.dataSet.edgeSet[edge.id] = edge))

    sideBarState.nor.visibleList.sort(this.sortByPkgPath.bind(this))
    sideBarState.ext.invisibleList.sort(this.sortByPkgPath.bind(this))
    sideBarState.std.invisibleList.sort(this.sortByPkgPath.bind(this))

    return sideBarState
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

  public getVisibleElements(nodeIDList: string[]) {
    const nodeList: Graph.INode[] = nodeIDList.map(nodeID =>
      this.getNode(nodeID)
    )

    const edgeList: Graph.IEdge[] = Object.values(this.dataSet.edgeSet).filter(
      edge => nodeIDList.includes(edge.from) && nodeIDList.includes(edge.to)
    )

    return { nodeList, edgeList }
  }

  private sortByPkgPath(prev: string, next: string) {
    if (
      this.dataSet.nodeSet[prev].meta.pkgPath <=
      this.dataSet.nodeSet[next].meta.pkgPath
    ) {
      return -1
    } else {
      return 1
    }
  }
}

function dispatchIDToList(
  sideBarState: State.ISideBarData,
  pkgType: Graph.PkgType,
  id: string
) {
  switch (pkgType) {
    case PkgType.NOR:
      sideBarState.nor.visibleList.push(id)
      break
    case PkgType.EXT:
      sideBarState.ext.invisibleList.push(id)
      break
    case PkgType.STD:
      sideBarState.std.invisibleList.push(id)
      break
  }
}

export default new DataSet()
