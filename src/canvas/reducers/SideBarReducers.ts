import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { State } from 'godeptypes'
import { DataAction, dataActions } from '../Actions'
import DataSet from '../DataSet'
import VisNetwork from '../VisNetwork'

const INITIAL_STATE: State.ISideBarState = {
  nor: { visibleList: [], invisibleList: [] },
  ext: { visibleList: [], invisibleList: [] },
  std: { visibleList: [], invisibleList: [] }
}

export default (state = INITIAL_STATE, action: DataAction) => {
  switch (action.type) {
    case getType(dataActions.initSideBarData):
      const visibleList = getVisibleList(action.payload)
      VisNetwork.show(visibleList)

      return action.payload
    case getType(dataActions.changeVisibility):
      if (action.payload.toShow) {
        return {
          ...state,
          [action.payload.pkgType]: show(
            state[action.payload.pkgType],
            action.payload.id
          )
        }
      } else {
        return {
          ...state,
          [action.payload.pkgType]: hide(
            state[action.payload.pkgType],
            action.payload.id
          )
        }
      }
    default:
      return state
  }
}

function hide(dataSet: State.ISideBarDataSet, id: string) {
  const visibleList = dataSet.visibleList.filter(element => id !== element)
  const invisibleList = dataSet.invisibleList.slice(0)
  invisibleList.push(id)
  invisibleList.sort(sortByPkgPath)

  VisNetwork.hide(id)

  return { visibleList, invisibleList }
}

function show(dataSet: State.ISideBarDataSet, id: string) {
  const invisibleList = dataSet.invisibleList.filter(element => id !== element)
  const visibleList = dataSet.visibleList.slice(0)
  visibleList.push(id)
  visibleList.sort(sortByPkgPath)

  VisNetwork.show(id)

  return { visibleList, invisibleList }
}

function getVisibleList(dataSet: State.ISideBarState) {
  return dataSet.nor.visibleList.concat(
    dataSet.ext.visibleList,
    dataSet.std.visibleList
  )
}

function sortByPkgPath(prev: string, next: string) {
  if (
    DataSet.getNode(prev).meta.pkgPath <= DataSet.getNode(next).meta.pkgPath
  ) {
    return -1
  } else {
    return 1
  }
}
