import * as vis from 'vis'
import { Graph, State } from 'godeptypes'
import DataSet from './DataSet'
import Store from './Store'
import { dataActions } from './Actions'
import { EdgeType } from './enums'

const NETWORK_OPTS: vis.Options = {
  nodes: {
    shape: 'dot',
    size: 10
  },
  groups: {
    nor: {
      color: '#5CC9F5'
    },
    std: {
      color: '#A1A9B8'
    },
    ext: {
      color: '#292D34'
    }
  },
  layout: {
    randomSeed: 1,
    improvedLayout: true
  },
  interaction: {
    multiselect: true
  },
  physics: {
    stabilization: false,
    solver: 'forceAtlas2Based'
  }
}

class VisNetwork {
  private nodes: vis.DataSet<Graph.INode> = new vis.DataSet([])
  private edges: vis.DataSet<Graph.IEdge> = new vis.DataSet([])
  private visNetwork: vis.Network

  public init(mountHTML: HTMLElement) {
    this.visNetwork = new vis.Network(
      mountHTML,
      { nodes: this.nodes, edges: this.edges },
      NETWORK_OPTS
    )

    this.visNetwork.on('click', this.click.bind(this))
  }

  public show(id: string | string[]) {
    const dataList = Array.isArray(id)
      ? DataSet.getVisibleElements(id)
      : DataSet.getVisibleElements([id])

    this.nodes.update(
      dataList.nodeList.map(node => {
        node.group = node.meta.pkgType
        return node
      })
    )

    this.edges.update(dataList.edgeList.map(styleEdge))
  }

  public hide(id: string | string[]) {
    this.nodes.remove(id)
  }

  public click(params: any) {
    const selected: State.ISelectedState = {
      nodeList: params.nodes,
      edgeList: params.edges
    }

    if (selected.nodeList.length !== 0 || selected.edgeList.length !== 0) {
      Store.dispatch(dataActions.select(selected))
    }
  }
}

function styleEdge(edge: Graph.IEdge) {
  if (edge.meta.type === EdgeType.COMP) {
    edge.color = { color: '#292D34' }
    edge.arrows = {
      from: {
        enabled: true,
        type: 'circle',
        scaleFactor: 0.5
      }
    }
  } else if (edge.meta.type === EdgeType.REL) {
    edge.arrows = 'to'
  }

  return edge
}

export default new VisNetwork()
