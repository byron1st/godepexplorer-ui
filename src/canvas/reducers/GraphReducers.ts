import * as _ from 'lodash'
import { IGraphState, ISideBarTypeData, ISideBarListItemData } from './Type'
import * as GraphType from '../graph/Type'
import { DataActionTypeKey, DataAction } from '../actions'
import DataSet from '../graph/DataSet'
import VisNetwork from '../graph/VisNetwork'

const INITIAL_STATE: IGraphState = {
  ignoreStd: true,
  ignoreExt: true,
  sideBarListData: []
}

export default (state = INITIAL_STATE, action: DataAction) => {
  switch (action.type) {
    case DataActionTypeKey.ADD_NEW_GRAPH:
      DataSet.addGraph(action.payload, state.ignoreStd, state.ignoreExt)
      VisNetwork.show(DataSet.getVisibleNodeIDList())

      return {
        ...state,
        sideBarListData: DataSet.getSideBarListData()
      }
    case DataActionTypeKey.SHOW_NODE:
      VisNetwork.show(action.payload.id)
      DataSet.show(action.payload.id)

      return {
        ...state,
        sideBarListData: _.map(
          state.sideBarListData,
          (item: ISideBarListItemData) =>
            item.id === action.payload.id ? { ...item, isVisible: true } : item
        )
      }
    case DataActionTypeKey.HIDE_NODE:
      VisNetwork.hide(action.payload.id)
      DataSet.hide(action.payload.id)

      return {
        ...state,
        sideBarListData: _.map(
          state.sideBarListData,
          (item: ISideBarListItemData) =>
            item.id === action.payload.id ? { ...item, isVisible: false } : item
        )
      }
    case DataActionTypeKey.EXPAND:
      const expandedNodeIDList = getExpandedNodeIDList(
        action.payload,
        state.ignoreStd,
        state.ignoreExt
      )

      DataSet.show(expandedNodeIDList)
      VisNetwork.show(DataSet.getVisibleNodeIDList())

      return {
        ...state,
        sideBarListData: _.map(
          state.sideBarListData,
          (item: ISideBarListItemData) =>
            _.includes(expandedNodeIDList, item.id)
              ? { ...item, isVisible: true }
              : item
        )
      }
    case DataActionTypeKey.TOGGLE_IGNORE_STD:
      return {
        ...state,
        ignoreStd: !state.ignoreStd
      }
    case DataActionTypeKey.TOGGLE_IGNORE_EXT:
      return {
        ...state,
        ignoreExt: !state.ignoreExt
      }
    default:
      return state
  }
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

function getExpandedNodeIDList(
  nodeID: string,
  ignoreStd: boolean,
  ignoreExt: boolean
): string[] {
  const node = DataSet.getNode(nodeID)
  const expandedNodeIDList = _.concat(
    _.map(
      _.keys(node.meta.sinkEdgeIDSet),
      edgeID => DataSet.getEdge(edgeID).from
    ),
    _.map(
      _.keys(node.meta.sourceEdgeIDSet),
      edgeID => DataSet.getEdge(edgeID).to
    )
  )

  if (ignoreStd || ignoreExt) {
    _.remove(expandedNodeIDList, (id: string) => {
      return (
        (ignoreStd && DataSet.getNode(id).type === GraphType.PkgType.STD) ||
        (ignoreExt && DataSet.getNode(id).type === GraphType.PkgType.EXT)
      )
    })
  }

  return expandedNodeIDList
}
