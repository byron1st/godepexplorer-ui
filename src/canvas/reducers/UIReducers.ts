import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { UIAction, uiActions } from '../Actions'

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

const INITIAL_STATE: IUIState = {
  infoPanelHeight: 300,
  isEdgeVisible: true,
  isExtVisible: true,
  isLoading: false,
  isNodeVisible: true,
  isStdVisible: true,
  loadingPath: '',
  sideBarWidth: 300
}

export function uiReducers(state = INITIAL_STATE, action: UIAction) {
  switch (action.type) {
    case getType(uiActions.updateWidth):
      return { ...state, sideBarWidth: action.payload }
    case getType(uiActions.updateHeight):
      return { ...state, infoPanelHeight: action.payload }
    case getType(uiActions.changeNodeVisible):
      return { ...state, isNodeVisible: !state.isNodeVisible }
    case getType(uiActions.changeEdgeVisible):
      return { ...state, isEdgeVisible: !state.isEdgeVisible }
    case getType(uiActions.turnOnLoadingIndicator):
      return { ...state, loadingPath: action.payload, isLoading: true }
    case getType(uiActions.turnOffLoadingIndicator):
      return { ...state, loadingPath: '', isLoading: false }
    case getType(uiActions.changeStdVisible):
      return { ...state, isStdVisible: !state.isStdVisible }
    case getType(uiActions.changeExtVisible):
      return { ...state, isExtVisible: !state.isExtVisible }
    default:
      return state
  }
}
