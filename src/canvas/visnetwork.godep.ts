import * as vis from 'vis'
import * as viscommon from './visnetwork.common'
import * as ipc from './ipc'

export interface Node extends vis.Node {
  id: string
  label: string
  packagePath: string
  packageName: string
  packageDir: string
  isPkg: boolean
  isExternal: boolean
  isStd: boolean
  funcSet: { [func: string]: boolean }
}

export interface Edge extends vis.Edge {
  id: string
  from: string
  to: string
  type: 0 | 1
  count: number
  depAtFunc: { [key: string]: boolean }
  arrows?: 'to' | 'from' | 'middle'
}

class GoDepVisNetwork extends viscommon.VisNetwork<Node, Edge> {
  initNetwork (visnetwork: vis.Network) {
    visnetwork.on('doubleClick', this.getDepsForPkg)
    visnetwork.on('click', this.showInfo)
  }

  getDepsForPkg = (params: any) => {
    if (params.nodes.length === 0) {
      return
    }
  
    const id: string = params.nodes[0]
    const pkg = this.nodes.get(id)
  
    ipc.sendExpandingReq(pkg.packagePath)
  }

  showInfo = (params: any) => {
    let info: viscommon.GraphElements<Node, Edge> = {
      nodes: params.nodes.map((nodeId: string) => this.nodes.get(nodeId)),
      edges: params.edges.map((edgeId: string) => this.edges.get(edgeId))
    }

    if (info.nodes.length !== 0 || info.edges.length !== 0) {
      ipc.sendInfo(info)
    }
  }

  addDepsToGraph = (resData: viscommon.GraphElements<Node, Edge>) => {
    this.nodes.update(resData.nodes)
    this.edges.update(resData.edges.map(edge => {
      edge.arrows = 'to'
      return edge
    }))
  }

}

export default new GoDepVisNetwork()