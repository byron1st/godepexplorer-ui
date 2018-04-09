import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { State } from 'godeptypes'
import { UIAction, uiActions } from '../Actions'

const INITIAL_STATE: State.IUIState = {
  infoPanelHeight: 300,
  isEdgeVisible: true,
  isLoading: false,
  isNodeVisible: true,
  loadingPath: '',
  sideBarWidth: 300,
  pkgImported: false
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
    case getType(uiActions.togglePkgImported):
      return { ...state, pkgImported: !state.pkgImported }
    default:
      return state
  }
}
