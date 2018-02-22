import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { uiActions, UIAction } from '../Actions'

export type UIState = {
  readonly sideBarWidth: number
  readonly infoPanelHeight: number
  readonly isNodeVisible: boolean
  readonly isEdgeVisible: boolean
}

const INITIAL_STATE: UIState = {
  sideBarWidth: 300,
  infoPanelHeight: 300,
  isNodeVisible: true,
  isEdgeVisible: true
}

export function uiReducers (state = INITIAL_STATE, action: UIAction) {
  switch(action.type) {
    case getType(uiActions.updateWidth):
      return { ...state, sideBarWidth: action.payload }
    case getType(uiActions.updateHeight):
      return { ...state, infoPanelHeight: action.payload }
    case getType(uiActions.changeNodeVisible):
      return { ...state, isNodeVisible: !state.isNodeVisible }
    case getType(uiActions.changeEdgeVisible):
      return { ...state, isEdgeVisible: !state.isEdgeVisible }
    default:
      return state
  }
}