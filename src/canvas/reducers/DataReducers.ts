import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { State } from 'godeptypes'
import { DataAction, dataActions } from '../Actions'
import SideBarReducers from './SideBarReducers'
import SelectedReducers from './SelectedReducers'
import InfoPanelReducers from './InfoPanelReducers'

export const dataReducers = combineReducers<State.IDataState>({
  selected: SelectedReducers,
  infoPanelData: InfoPanelReducers,
  sideBarData: SideBarReducers
})
