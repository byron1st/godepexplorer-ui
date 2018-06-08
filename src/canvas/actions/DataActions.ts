import { State, Graph } from 'godeptypes'

export enum DataActionTypeKey {
  INIT_SIDEBARDATA = 'INIT_SIDEBARDATA',
  SHOW_NODE = 'SHOW_NODE',
  HIDE_NODE = 'HIDE_NODE',
  SELECT = 'SELECT',
  DESELECT = 'DESELECT',
  EXPAND = 'EXPAND',
  TOGGLE_IGNORE_STD = 'TOGGLE_IGNORE_STD',
  SHOW_INFO = 'SHOW_INFO'
}

interface IInitSideBarDataAction {
  type: DataActionTypeKey.INIT_SIDEBARDATA
  payload: Graph.IListGraph
}

export function initSideBarData(
  initSideBarState: Graph.IListGraph
): IInitSideBarDataAction {
  return {
    type: DataActionTypeKey.INIT_SIDEBARDATA,
    payload: initSideBarState
  }
}

interface IShowNodeAction {
  type: DataActionTypeKey.SHOW_NODE
  payload: { id: string; type: string }
}

export function showNode(id: string, type: string): IShowNodeAction {
  return {
    type: DataActionTypeKey.SHOW_NODE,
    payload: { id, type }
  }
}

interface IHideNodeAction {
  type: DataActionTypeKey.HIDE_NODE
  payload: { id: string; type: string }
}

export function hideNode(id: string, type: string): IHideNodeAction {
  return {
    type: DataActionTypeKey.HIDE_NODE,
    payload: { id, type }
  }
}

interface ISelectAction {
  type: DataActionTypeKey.SELECT
  payload: State.ISelectedState
}

export function select(selected: State.ISelectedState): ISelectAction {
  return {
    type: DataActionTypeKey.SELECT,
    payload: selected
  }
}

interface IDeselectAction {
  type: DataActionTypeKey.DESELECT
  payload: State.ISelectedState
}

export function deselect(deselected: State.ISelectedState): IDeselectAction {
  return {
    type: DataActionTypeKey.DESELECT,
    payload: deselected
  }
}

interface IExpandAction {
  type: DataActionTypeKey.EXPAND
  payload: string
}

export function expand(nodeID: string): IExpandAction {
  return {
    type: DataActionTypeKey.EXPAND,
    payload: nodeID
  }
}

interface IToggleIgnoreStdAction {
  type: DataActionTypeKey.TOGGLE_IGNORE_STD
}

export function toggleIgnoreStd(): IToggleIgnoreStdAction {
  return {
    type: DataActionTypeKey.TOGGLE_IGNORE_STD
  }
}

interface IShowInfoAction {
  type: DataActionTypeKey.SHOW_INFO
  payload: State.ISelectedState
}

export function showInfo(infoPanelData: State.ISelectedState): IShowInfoAction {
  return {
    type: DataActionTypeKey.SHOW_INFO,
    payload: infoPanelData
  }
}

export type DataAction =
  | IInitSideBarDataAction
  | IShowNodeAction
  | IHideNodeAction
  | ISelectAction
  | IDeselectAction
  | IExpandAction
  | IToggleIgnoreStdAction
  | IShowInfoAction
