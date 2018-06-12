import * as _ from 'lodash'
import { IGraphState, ISideBarTypeData, ISideBarListItemData } from './Type'
import * as GraphType from '../graph/Type'
import { DataActionTypeKey, DataAction } from '../actions'
import DataSet from '../graph/DataSet'
import VisNetwork from '../graph/VisNetwork'

const INITIAL_STATE: IGraphState = {
  ignoreStd: true,
  sideBarListData: []
}

export default (state = INITIAL_STATE, action: DataAction) => {
  switch (action.type) {
    case DataActionTypeKey.ADD_NEW_GRAPH:
      DataSet.addGraph(action.payload, state.ignoreStd)
      VisNetwork.show(DataSet.getVisibleNodeIDList())

      return {
        ...INITIAL_STATE,
        sideBarListData: DataSet.getSideBarListData()
      }
    case DataActionTypeKey.SHOW_NODE:
      VisNetwork.show(action.payload.id)
      DataSet.show(action.payload.id)

      return {
        ignoreStd: state.ignoreStd,
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
        ignoreStd: state.ignoreStd,
        sideBarListData: _.map(
          state.sideBarListData,
          (item: ISideBarListItemData) =>
            item.id === action.payload.id ? { ...item, isVisible: false } : item
        )
      }
    case DataActionTypeKey.EXPAND:
      const updatedState = expandNode(action.payload, state)

      return updatedState
    case DataActionTypeKey.TOGGLE_IGNORE_STD:
      return {
        ...state,
        ignoreStd: !state.ignoreStd
      }
    default:
      return state
  }
}

function hide(dataSet: ISideBarTypeData, id: string) {
  return {
    visibleList: _.without(dataSet.visibleList, id),
    invisibleList: _.union(dataSet.invisibleList, [id]).sort(sortByPkgPath)
  }
}

function show(dataSet: ISideBarTypeData, id: string | string[]) {
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

function sortByPkgPath(prev: string, next: string) {
  if (
    DataSet.getNode(prev).meta.pkgPath <= DataSet.getNode(next).meta.pkgPath
  ) {
    return -1
  } else {
    return 1
  }
}

function expandNode(nodeID: string, state: IGraphState) {
  const node = DataSet.getNode(nodeID)
  const newlyShownNodeIDList = _.concat(
    _.map(
      _.keys(node.meta.sinkEdgeIDSet),
      edgeID => DataSet.getEdge(edgeID).from
    ),
    _.map(
      _.keys(node.meta.sourceEdgeIDSet),
      edgeID => DataSet.getEdge(edgeID).to
    )
  )

  DataSet.show(newlyShownNodeIDList)
  VisNetwork.show(DataSet.getVisibleNodeIDList())

  return {
    ignoreStd: state.ignoreStd,
    sideBarListData: state.ignoreStd
      ? _.map(
          state.sideBarListData,
          (item: ISideBarListItemData) =>
            _.includes(newlyShownNodeIDList, item.id) &&
            item.type !== GraphType.PkgType.STD
              ? { ...item, isVisible: true }
              : item
        )
      : _.map(
          state.sideBarListData,
          (item: ISideBarListItemData) =>
            _.includes(newlyShownNodeIDList, item.id)
              ? { ...item, isVisible: true }
              : item
        )
  }
}

function getNodeIDListFilteredByPkgType(
  nodeIDList: string[],
  pkgType: GraphType.PkgType
) {
  return _.filter(
    nodeIDList,
    nodeID => DataSet.getNode(nodeID).meta.pkgType === pkgType
  )
}

function extractSideBarTypeDataFromINodeList(
  nodeList: GraphType.INode[],
  ignoreStd: boolean
): ISideBarTypeData {
  return _.reduce(
    nodeList,
    (accumulated: ISideBarTypeData, currentNode: GraphType.INode) => {
      ignoreStd && currentNode.type === GraphType.PkgType.STD
        ? accumulated.invisibleList.push(currentNode.id)
        : accumulated.visibleList.push(currentNode.id)

      return accumulated
    },
    { visibleList: [], invisibleList: [] }
  )
}
