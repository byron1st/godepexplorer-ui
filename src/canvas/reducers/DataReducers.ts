import { combineReducers } from 'redux'
import { IDataState } from './Type'
import SideBarReducers from './SideBarReducers'
import SelectedReducers from './SelectedReducers'
import InfoPanelReducers from './InfoPanelReducers'

export const dataReducers = combineReducers<IDataState>({
  selected: SelectedReducers,
  infoPanelData: InfoPanelReducers,
  sideBarData: SideBarReducers
})
