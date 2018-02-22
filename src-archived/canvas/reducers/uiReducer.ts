import { UpdateSideBarWidthAction, UpdateInfoPanelHeightAction } from '../actions/actions'
import { UPDATE_SIDEBARWIDTH_ACTION, UPDATE_INFOPANELHEIGHT_ACTION } from '../actions/actionTypes'

interface UIState {
  sideBarWidth: number
  infoPanelHeight: number
}

const INITIAL_STATE = {
  sideBarWidth: 300,
  infoPanelHeight: 300
}

export default (state: UIState = INITIAL_STATE, action: UpdateSideBarWidthAction | UpdateInfoPanelHeightAction) => {
  switch (action.type) {
    case UPDATE_SIDEBARWIDTH_ACTION:
      return {
        ...state,
        sideBarWidth: (action as UpdateSideBarWidthAction).width
      }
    case UPDATE_INFOPANELHEIGHT_ACTION:
      return {
        ...state,
        infoPanelHeight: (action as UpdateInfoPanelHeightAction).height
      }
    default:
      return state
  }
}