import * as vis from 'vis'
import * as _ from 'lodash'
import { remote } from 'electron'
import * as Type from './Type'
import * as StateType from '../reducers/Type'
import DataSet from './DataSet'
import Store from '../reducers'
import { showInfo, hideNode, expand, select, deselect } from '../actions'

enum ElemType {
  node,
  edge
}

interface IHoveredElement {
  type: ElemType
  ID: string
}

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
    multiselect: true,
    hover: true,
    hoverConnectedEdges: false
  },
  physics: {
    stabilization: true,
    solver: 'forceAtlas2Based'
  }
}

let hovered: IHoveredElement
let releaseParams: any = {}

class VisNetwork {
  private nodes: vis.DataSet<Type.INode> = new vis.DataSet([])
  private edges: vis.DataSet<Type.IEdge> = new vis.DataSet([])
  private visNetwork: vis.Network

  public init(mountHTML: HTMLElement) {
    this.visNetwork = new vis.Network(
      mountHTML,
      { nodes: this.nodes, edges: this.edges },
      NETWORK_OPTS
    )

    this.visNetwork.on('click', click)
    this.visNetwork.on('oncontext', openContextMenu)
    this.visNetwork.on('hoverNode', recordHoveredParams)
    this.visNetwork.on('hoverEdge', recordHoveredParams)
    this.visNetwork.on('deselectNode', deselectNode)
    this.visNetwork.on('deselectEdge', deselectEdge)
    this.visNetwork.on('release', recordReleaseParams)
  }

  public show(id: string | string[]) {
    // @ts-ignore nodeID is always string in this system.
    const currentVisibleNodeIDList: string[] = this.nodes.getIds()
    const dataList = Array.isArray(id)
      ? DataSet.getVisibleElements(_.concat(id, currentVisibleNodeIDList))
      : DataSet.getVisibleElements([id, ...currentVisibleNodeIDList])

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

    Array.isArray(id)
      ? _.forEach(id, singleID =>
          this.edges.remove(DataSet.selectNode(singleID).edgeList)
        )
      : this.edges.remove(DataSet.selectNode(id).edgeList)
  }

  public setSelection(selected: StateType.ISelectedState) {
    this.visNetwork.setSelection({
      nodes: _.filter(
        selected.nodeList,
        nodeID => this.nodes.get(nodeID) !== null
      ),
      edges: _.filter(
        selected.edgeList,
        edgeID => this.edges.get(edgeID) !== null
      )
    })
  }
}

function styleEdge(edge: Type.IEdge) {
  if (edge.meta.type === Type.EdgeType.COMP) {
    edge.color = { color: '#292D34' }
    edge.arrows = {
      from: {
        enabled: true,
        type: 'circle',
        scaleFactor: 0.5
      }
    }
  } else if (edge.meta.type === Type.EdgeType.REL) {
    edge.arrows = 'to'
  }

  return edge
}

function getRelatedEdgeIDs(nodeID: string) {
  const node = DataSet.getNode(nodeID)
  return _.concat(
    _.keys(node.meta.sinkEdgeIDSet),
    _.keys(node.meta.sourceEdgeIDSet)
  )
}

function getRelatedNodeIDs(edgeID: string) {
  const edge = DataSet.getEdge(edgeID)
  return [edge.from, edge.to]
}

function click(params: any) {
  const selected: StateType.ISelectedState = {
    nodeList: params.nodes,
    edgeList: params.edges
  }

  if (selected.nodeList.length !== 0 || selected.edgeList.length !== 0) {
    Store.dispatch(select(selected))
  }
}

function openContextMenu() {
  const menuTemplate = [
    {
      label: 'show info',
      click() {
        if (hovered.type === ElemType.node) {
          Store.dispatch(showInfo(DataSet.selectNode(hovered.ID)))
        } else if (hovered.type === ElemType.edge) {
          Store.dispatch(showInfo({ nodeList: [], edgeList: [hovered.ID] }))
        }
      }
    }
  ]

  if (hovered.type === ElemType.node && hovered.ID) {
    menuTemplate.unshift({
      label: 'hide',
      click() {
        Store.dispatch(
          hideNode(hovered.ID, DataSet.getNode(hovered.ID).meta.pkgType)
        )
      }
    })

    menuTemplate.unshift({
      label: 'expand',
      click() {
        Store.dispatch(expand(hovered.ID))
      }
    })
  }

  const menu = remote.Menu.buildFromTemplate(menuTemplate)
  menu.popup({ window: remote.getCurrentWindow() })
}

function deselectNode(params: any) {
  if (params.nodes.length === 0) {
    _.forEach(releaseParams.nodes, nodeID =>
      Store.dispatch(
        deselect({
          nodeList: [nodeID],
          edgeList: getRelatedEdgeIDs(nodeID)
        })
      )
    )
  }
}

function deselectEdge(params: any) {
  if (params.edges.length === 0) {
    _.forEach(releaseParams.edges, edgeID =>
      Store.dispatch(
        deselect({
          nodeList: getRelatedNodeIDs(edgeID),
          edgeList: [edgeID]
        })
      )
    )
  }
}

function recordHoveredParams(params: any) {
  hovered = params.node
    ? { type: ElemType.node, ID: params.node }
    : { type: ElemType.edge, ID: params.edge }
}

function recordReleaseParams(params: any) {
  releaseParams = params
}

export default new VisNetwork()
