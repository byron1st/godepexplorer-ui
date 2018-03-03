declare module 'godeptypes' {
  namespace Graph {
    export interface IListGraph {
      nodes: INode[]
      edges: IEdge[]
    }

    export interface INode extends vis.Node {
      id: string
      label: string
      meta: INodeMeta
    }

    export interface IEdge extends vis.Edge {
      id: string
      from: string
      to: string
      arrows?: 'to' | 'from' | 'middle' | any // optional type that is not defined in vis.Edge, but actually can be used.
      color?: any // http://visjs.org/docs/network/edges.html
      meta: IEdgeMeta
    }

    export type PkgType = 'nor' | 'ext' | 'std'

    export type EdgeType = 0 | 1

    interface INodeMeta {
      [key: string]: string | PkgType
      pkgPath: string
      pkgName: string
      pkgDir: string
      pkgType: PkgType
      // TODO: funcSet
    }

    interface IEdgeMeta {
      [key: string]: number | { [id: string]: IDepAtFunc }
      type: EdgeType
      depAtFunc: { [id: string]: IDepAtFunc }
    }

    interface IDepAtFunc {
      id: string
      from: string
      to: string
    }
  }

  namespace State {
    export interface IRootState {
      readonly ui: IUIState
      readonly data: IDataState
    }

    export interface IUIState {
      readonly sideBarWidth: number
      readonly infoPanelHeight: number
      readonly isNodeVisible: boolean
      readonly isEdgeVisible: boolean
      readonly loadingPath: string
      readonly isLoading: boolean
      readonly isStdVisible: boolean
      readonly isExtVisible: boolean
    }

    export interface IDataState {
      readonly selected: ISelectedState
      readonly sideBarData: ISideBarState
    }

    export interface ISelectedState {
      readonly nodeList: string[]
      readonly edgeList: string[]
    }

    // key values are matched with PkgType.
    export interface ISideBarState {
      readonly nor: ISideBarDataSet
      readonly ext: ISideBarDataSet
      readonly std: ISideBarDataSet
    }

    export interface ISideBarDataSet {
      readonly visibleList: string[]
      readonly invisibleList: string[]
    }
  }

  namespace Network {
    export interface IRequest {
      pkgName: string
    }

    export interface IResponse {
      pkgName: string
      graph: Graph.IListGraph
    }
  }

  interface IElementSet<T> {
    [id: string]: T
  }

  export interface IGraphDataSet {
    nodeSet: IElementSet<Graph.INode>
    edgeSet: IElementSet<Graph.IEdge>
  }
}
