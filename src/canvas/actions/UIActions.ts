export enum UIActionTypeKey {
  UPDATE_WIDTH = 'UPDATE_WIDTH',
  UPDATE_HEIGHT = 'UPDATE_HEIGHT',
  CHANGE_NODE_VISIBLE = 'CHANGE_NODE_VISIBLE',
  CHANGE_EDGE_VISIBLE = 'CHANGE_EDGE_VISIBLE',
  TURNON_LOADING_INDICATOR = 'TURNON_LOADING_INDICATOR',
  TURNOFF_LOADING_INDICATOR = 'TURNOFF_LOADING_INDICATOR',
  TOGGLE_PKG_IMPORTED = 'TOGGLE_PKG_IMPORTED'
}

interface IUpdateWidthAction {
  type: UIActionTypeKey.UPDATE_WIDTH
  payload: number
}

export function updateWidth(newWidth: number): IUpdateWidthAction {
  return {
    type: UIActionTypeKey.UPDATE_WIDTH,
    payload: newWidth
  }
}

interface IUpdateHeightAction {
  type: UIActionTypeKey.UPDATE_HEIGHT
  payload: number
}

export function updateHeight(newHeight: number): IUpdateHeightAction {
  return {
    type: UIActionTypeKey.UPDATE_HEIGHT,
    payload: newHeight
  }
}

interface IChangeNodeVisibleAction {
  type: UIActionTypeKey.CHANGE_NODE_VISIBLE
}

export function changeNodeVisible(): IChangeNodeVisibleAction {
  return {
    type: UIActionTypeKey.CHANGE_NODE_VISIBLE
  }
}

interface IChangeEdgeVisibleAction {
  type: UIActionTypeKey.CHANGE_EDGE_VISIBLE
}

export function changeEdgeVisible(): IChangeEdgeVisibleAction {
  return {
    type: UIActionTypeKey.CHANGE_EDGE_VISIBLE
  }
}

interface ITurnOnLoadingIndicatorAction {
  type: UIActionTypeKey.TURNON_LOADING_INDICATOR
  payload: string
}

export function turnOnLoadingIndicator(
  packagePath: string
): ITurnOnLoadingIndicatorAction {
  return {
    type: UIActionTypeKey.TURNON_LOADING_INDICATOR,
    payload: packagePath
  }
}

interface ITurnOffLoadingIndicatorAction {
  type: UIActionTypeKey.TURNOFF_LOADING_INDICATOR
}

export function turnOffLoadingIndicator(): ITurnOffLoadingIndicatorAction {
  return {
    type: UIActionTypeKey.TURNOFF_LOADING_INDICATOR
  }
}

interface ITogglePkgImportedAction {
  type: UIActionTypeKey.TOGGLE_PKG_IMPORTED
}

export function togglePkgImported(): ITogglePkgImportedAction {
  return {
    type: UIActionTypeKey.TOGGLE_PKG_IMPORTED
  }
}

export type UIAction =
  | IUpdateWidthAction
  | IUpdateHeightAction
  | IChangeNodeVisibleAction
  | IChangeEdgeVisibleAction
  | ITurnOnLoadingIndicatorAction
  | ITurnOffLoadingIndicatorAction
  | ITogglePkgImportedAction
