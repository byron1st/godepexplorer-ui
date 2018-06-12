import { PkgType } from '../graph/Type'

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
  readonly pkgImported: boolean
}

export interface IDataState {
  readonly selected: ISelectedState
  readonly graphData: IGraphState
  readonly infoPanelData: ISelectedState
}

export interface ISelectedState {
  readonly nodeList: string[]
  readonly edgeList: string[]
}

export interface IGraphState {
  readonly ignoreStd: boolean
  readonly sideBarListData: ISideBarListItemData[]
  readonly nodeList: ISideBarTypeData
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
