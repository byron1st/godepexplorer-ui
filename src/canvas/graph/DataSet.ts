import * as Type from './Type'

interface IElementSet<T> {
  [id: string]: T
}

export interface IGraphDataSet {
  nodeSet: IElementSet<Type.INode>
  edgeSet: IElementSet<Type.IEdge>
}

class DataSet {
  private dataSet: IGraphDataSet = { nodeSet: {}, edgeSet: {} }

  public init(graph: Type.IListGraph) {
    graph.nodes.forEach(node => {
      this.dataSet.nodeSet[node.id] = node
    })

    graph.edges.forEach(edge => (this.dataSet.edgeSet[edge.id] = edge))
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
    const nodeList: Type.INode[] = nodeIDList.map(nodeID =>
      this.getNode(nodeID)
    )

    const edgeList: Type.IEdge[] = Object.values(this.dataSet.edgeSet).filter(
      edge => nodeIDList.includes(edge.from) && nodeIDList.includes(edge.to)
    )

    return { nodeList, edgeList }
  }
}

export default new DataSet()
