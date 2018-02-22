import * as actionTypes from './actionTypes'

export interface Action {
  type: string
}

export interface UpdateSideBarWidthAction extends Action {
  width: number
}

export interface UpdateInfoPanelHeightAction extends Action {
  height: number
}

export function updateSideBarWidth (newWidth: number) {
  return {
    type: actionTypes.UPDATE_SIDEBARWIDTH_ACTION,
    width: newWidth
  }
}

export function updateInfoPanelHeight (height: number): UpdateInfoPanelHeightAction {
  return {
    type: actionTypes.UPDATE_INFOPANELHEIGHT_ACTION,
    height: height
  }
}