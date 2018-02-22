import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { UIAction, uiActions } from '../actions'

export type UIState = {
  readonly sideBarWidth: number
  // readonly infoPanelHeight: number
  // readonly isNodeVisible: boolean
  // readonly isEdgeVisible: boolean
}

const INITIAL_STATE: UIState = {
  sideBarWidth: 300
}

export const uiReducers = (state = INITIAL_STATE, action: UIAction) => {
  switch(action.type) {
    case getType(uiActions.updateWidth):
      return { ...state, sideBarWidth: action.payload }
    default:
      return state
  }
}