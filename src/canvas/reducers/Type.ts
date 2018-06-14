import { PkgType, IEdge, INode, IDepAtFunc } from '../graph/Type'

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
}

export interface IDataState {
  readonly selected: ISelectedState
  readonly graphData: IGraphState
  readonly infoPanelData: IInfoPanelData
}

export interface ISelectedState {
  readonly nodeList: string[]
  readonly edgeList: string[]
}

export interface IGraphState {
  readonly ignoreStd: boolean
  readonly ignoreExt: boolean
  readonly sideBarListData: ISideBarListItemData[]
}

export enum InfoPanelDataKind {
  NODE = 'node',
  EDGE = 'edge'
}

export interface IInfoPanelData {
  // common
  readonly id: string
  readonly kind: InfoPanelDataKind
  readonly label: string

  // Node
  readonly pkgType?: string
  readonly pkgPath?: string
  readonly pkgDir?: string
  readonly sinkEdgeIDList?: string[]
  readonly sourceEdgeIDList?: string[]

  // Edge
  readonly sourcePkgID?: string
  readonly targetPkgID?: string
  readonly depAtFuncSet?: { [id: string]: IDepAtFunc }
}

export interface ISideBarListItemData {
  readonly id: string
  readonly label: string
  readonly path: string
  readonly type: PkgType
  readonly isVisible: boolean
}

export interface ISideBarTypeData {
  readonly visibleList: string[]
  readonly invisibleList: string[]
}
