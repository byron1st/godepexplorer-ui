import { IUIState } from './Type'
import { UIActionTypeKey, UIAction } from '../actions'

const INITIAL_STATE: IUIState = {
  infoPanelHeight: 300,
  isEdgeVisible: true,
  isLoading: false,
  isNodeVisible: true,
  loadingPath: '',
  sideBarWidth: 300
}

export function uiReducers(state = INITIAL_STATE, action: UIAction) {
  switch (action.type) {
    case UIActionTypeKey.UPDATE_WIDTH:
      return { ...state, sideBarWidth: action.payload }
    case UIActionTypeKey.UPDATE_HEIGHT:
      return { ...state, infoPanelHeight: action.payload }
    case UIActionTypeKey.CHANGE_NODE_VISIBLE:
      return { ...state, isNodeVisible: !state.isNodeVisible }
    case UIActionTypeKey.CHANGE_EDGE_VISIBLE:
      return { ...state, isEdgeVisible: !state.isEdgeVisible }
    case UIActionTypeKey.TURNON_LOADING_INDICATOR:
      return { ...state, loadingPath: action.payload, isLoading: true }
    case UIActionTypeKey.TURNOFF_LOADING_INDICATOR:
      return { ...state, loadingPath: '', isLoading: false }
    default:
      return state
  }
}
