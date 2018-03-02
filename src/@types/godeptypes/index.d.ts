declare module 'godeptypes' {
  namespace Graph {
    export interface IListGraph {
      nodes: INode[]
      edges: IEdge[]
    }

    export interface INode extends vis.Node {
      id: string
      label: string
      isVisible: boolean
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

    export enum EdgeType {
      COMP = 0,
      REL
    }

    interface INodeMeta {
      [key: string]: string | ('nor' | 'ext' | 'std')
      pkgPath: string
      pkgName: string
      pkgDir: string
      pkgType: 'nor' | 'ext' | 'std'
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

  namespace RealmScheme {
    type INodeMeta = Graph.INodeMeta

    export interface INode {
      id: string
      label: string
      isVisible: boolean
      meta: INodeMeta
    }

    export interface IEdge {
      id: string
      from: string
      to: string
      meta: IEdgeMeta
    }

    interface IEdgeMeta {
      type: Graph.EdgeType
      depAtFunc: Graph.IDepAtFunc[]
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
      readonly selected: string[]
      readonly sideBarData: ISideBarState
    }

    export interface ISideBarState {
      readonly normalPkgSet: ISideBarDataSet
      readonly extPkgSet: ISideBarDataSet
      readonly stdPkgSet: ISideBarDataSet
    }

    export interface ISideBarDataSet {
      readonly visibleList: ISideBarElement[]
      readonly invisibleList: ISideBarElement[]
    }

    export interface ISideBarElement {
      readonly id: string
      readonly label: string
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
}
