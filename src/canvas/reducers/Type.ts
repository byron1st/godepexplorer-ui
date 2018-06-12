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

// key values are matched with PkgType.
export interface IGraphState {
  readonly ignoreStd: boolean
  readonly nodeList: ISideBarTypeData
}

export interface ISideBarTypeData {
  readonly visibleList: string[]
  readonly invisibleList: string[]
}
