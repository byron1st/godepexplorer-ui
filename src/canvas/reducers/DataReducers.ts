import { combineReducers } from 'redux'
import { IDataState } from './Type'
import SideBarReducers from './GraphReducers'
import SelectedReducers from './SelectedReducers'
import InfoPanelReducers from './InfoPanelReducers'

export const dataReducers = combineReducers<IDataState>({
  selected: SelectedReducers,
  infoPanelData: InfoPanelReducers,
  graphData: SideBarReducers
})
