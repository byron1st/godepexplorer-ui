import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import * as _ from 'lodash'
import { State, Graph } from 'godeptypes'
import { DataAction, dataActions } from '../Actions'
import DataSet from '../DataSet'
import VisNetwork from '../VisNetwork'
import { PkgType } from '../enums'

const INITIAL_STATE: State.ISideBarState = {
  ignoreStd: true,
  nor: { visibleList: [], invisibleList: [] },
  ext: { visibleList: [], invisibleList: [] },
  std: { visibleList: [], invisibleList: [] }
}

export default (state = INITIAL_STATE, action: DataAction) => {
  switch (action.type) {
    case getType(dataActions.initSideBarData):
      VisNetwork.show(getVisibleList(action.payload))

      return {
        ...INITIAL_STATE,
        ...action.payload
      }
    case getType(dataActions.showNode):
      VisNetwork.show(action.payload.id)

      if (action.payload.pkgType === PkgType.STD && state.ignoreStd) {
        return state
      }

      return {
        ...state,
        [action.payload.pkgType]: show(
          state[action.payload.pkgType],
          action.payload.id
        )
      }
    case getType(dataActions.hideNode):
      VisNetwork.hide(action.payload.id)

      return {
        ...state,
        [action.payload.pkgType]: hide(
          state[action.payload.pkgType],
          action.payload.id
        )
      }
    case getType(dataActions.expand):
      const updatedState = expandNode(action.payload, state)
      VisNetwork.show(getVisibleList(updatedState))

      return updatedState
    case getType(dataActions.toggleIgnoreStd):
      return {
        ...state,
        ignoreStd: !state.ignoreStd
      }
    default:
      return state
  }
}

function hide(dataSet: State.ISideBarDataSet, id: string) {
  return {
    visibleList: _.without(dataSet.visibleList, id),
    invisibleList: _.union(dataSet.invisibleList, [id]).sort(sortByPkgPath)
  }
}

function show(dataSet: State.ISideBarDataSet, id: string | string[]) {
  return Array.isArray(id)
    ? {
        visibleList: _.union(dataSet.visibleList, id).sort(sortByPkgPath),
        invisibleList: _.difference(dataSet.invisibleList, id)
      }
    : {
        visibleList: _.union(dataSet.visibleList, [id]).sort(sortByPkgPath),
        invisibleList: _.without(dataSet.invisibleList, id)
      }
}

function getVisibleList(dataSet: State.ISideBarData) {
  return _.concat(
    dataSet.nor.visibleList,
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

function expandNode(nodeID: string, state: State.ISideBarState) {
  const node = DataSet.getNode(nodeID)
  const connectedNodeIDList = _.concat(
    _.map(
      _.keys(node.meta.sinkEdgeIDSet),
      edgeID => DataSet.getEdge(edgeID).from
    ),
    _.map(
      _.keys(node.meta.sourceEdgeIDSet),
      edgeID => DataSet.getEdge(edgeID).to
    )
  )

  const stdSet = state.ignoreStd
    ? state.std
    : show(
        state.std,
        getNodeIDListFilteredByPkgType(connectedNodeIDList, PkgType.STD)
      )

  return {
    ignoreStd: state.ignoreStd,
    nor: show(
      state.nor,
      getNodeIDListFilteredByPkgType(connectedNodeIDList, PkgType.NOR)
    ),
    ext: show(
      state.ext,
      getNodeIDListFilteredByPkgType(connectedNodeIDList, PkgType.EXT)
    ),
    std: stdSet
  }
}

function getNodeIDListFilteredByPkgType(
  nodeIDList: string[],
  pkgType: Graph.PkgType
) {
  return _.filter(
    nodeIDList,
    nodeID => DataSet.getNode(nodeID).meta.pkgType === pkgType
  )
}
