import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { DataAction, dataActions } from '../Actions'
import { ISideBarElement } from '../../GlobalTypes'

interface ISideBarDataSet {
  visibleList: ISideBarElement[]
  invisibleList: ISideBarElement[]
}

export interface ISideBarStore {
  normalPkgSet: ISideBarDataSet
  extPkgSet: ISideBarDataSet
  stdPkgSet: ISideBarDataSet
}

const INITIAL_STATE: ISideBarDataSet = {
  visibleList: [],
  invisibleList: []
}

export const sideBarReducers = combineReducers<ISideBarStore>({
  normalPkgSet: (
    state: ISideBarDataSet = INITIAL_STATE,
    action: DataAction
  ) => {
    switch (action.type) {
      case getType(dataActions.initNormalList):
        return {
          visibleList: action.payload,
          invisibleList: []
        }
      case getType(dataActions.displayNormal):
        return {
          visibleList: addToList(state.visibleList, action.payload),
          invisibleList: removeFromList(state.invisibleList, action.payload.id)
        }
      case getType(dataActions.hideNormal):
        return {
          visibleList: removeFromList(state.visibleList, action.payload.id),
          invisibleList: addToList(state.invisibleList, action.payload)
        }
      default:
        return state
    }
  }
})

function addToList(state: ISideBarElement[], element: ISideBarElement) {
  const list = state.slice(0)
  list.push(element)
  list.sort(sortByLabel)
  return list
}

function removeFromList(state: ISideBarElement[], id: string) {
  const list = state.filter(element => element.id !== id)
  return list
}

function sortByLabel(prev: ISideBarElement, next: ISideBarElement) {
  if (prev.label <= next.label) {
    return -1
  } else {
    return 1
  }
}
