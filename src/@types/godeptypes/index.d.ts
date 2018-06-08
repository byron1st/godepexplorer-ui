declare module 'godeptypes' {
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
      readonly pkgImported: boolean
    }

    export interface IDataState {
      readonly selected: ISelectedState
      readonly sideBarData: ISideBarState
      readonly infoPanelData: ISelectedState
    }

    export interface ISelectedState {
      readonly nodeList: string[]
      readonly edgeList: string[]
    }

    export interface ISideBarData {
      readonly [type: string]: ISideBarDataSet
    }

    // key values are matched with PkgType.
    export interface ISideBarState {
      readonly ignoreStd: boolean
      readonly data: ISideBarData
    }

    export interface ISideBarDataSet {
      readonly visibleList: string[]
      readonly invisibleList: string[]
    }
  }
}
