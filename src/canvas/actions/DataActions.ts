import * as StateType from '../reducers/Type'
import * as GraphType from '../graph/Type'

export enum DataActionTypeKey {
  ADD_NEW_GRAPH = 'ADD_NEW_GRAPH',
  SHOW_NODE = 'SHOW_NODE',
  HIDE_NODE = 'HIDE_NODE',
  SELECT = 'SELECT',
  DESELECT = 'DESELECT',
  EXPAND = 'EXPAND',
  TOGGLE_IGNORE_STD = 'TOGGLE_IGNORE_STD',
  TOGGLE_IGNORE_EXT = 'TOGGLE_IGNORE_EXT',
  SHOW_INFO = 'SHOW_INFO'
}

interface IInitSideBarDataAction {
  type: DataActionTypeKey.ADD_NEW_GRAPH
  payload: GraphType.IListGraph
}

export function addNewGraph(
  newGraph: GraphType.IListGraph
): IInitSideBarDataAction {
  return {
    type: DataActionTypeKey.ADD_NEW_GRAPH,
    payload: newGraph
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
  payload: StateType.ISelectedState
}

export function select(selected: StateType.ISelectedState): ISelectAction {
  return {
    type: DataActionTypeKey.SELECT,
    payload: selected
  }
}

interface IDeselectAction {
  type: DataActionTypeKey.DESELECT
  payload: StateType.ISelectedState
}

export function deselect(
  deselected: StateType.ISelectedState
): IDeselectAction {
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

interface IToggleIgnoreExtAction {
  type: DataActionTypeKey.TOGGLE_IGNORE_EXT
}

export function toggleIgnoreExt(): IToggleIgnoreExtAction {
  return {
    type: DataActionTypeKey.TOGGLE_IGNORE_EXT
  }
}

interface IShowInfoAction {
  type: DataActionTypeKey.SHOW_INFO
  payload: StateType.ISelectedState
}

export function showInfo(
  infoPanelData: StateType.ISelectedState
): IShowInfoAction {
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
  | IToggleIgnoreExtAction
  | IShowInfoAction
