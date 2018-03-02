import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { DataAction, dataActions } from '../Actions'
import { sideBarReducers, ISideBarStore } from './SideBarReducers'

export interface IDataStore {
  // readonly infoPanelData: string[] // TODO: node[], edge[]로 구분해야 함.
  readonly sideBarData: ISideBarStore
}

export const dataReducers = combineReducers<IDataStore>({
  sideBarData: sideBarReducers
})

export { ISideBarStore } from './SideBarReducers'
