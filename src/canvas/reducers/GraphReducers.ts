import * as _ from 'lodash'
import { IGraphState, ISideBarTypeData } from './Type'
import * as GraphType from '../graph/Type'
import { DataActionTypeKey, DataAction } from '../actions'
import DataSet from '../graph/DataSet'
import VisNetwork from '../graph/VisNetwork'

const INITIAL_STATE: IGraphState = {
  ignoreStd: true,
  nodeList: { visibleList: [], invisibleList: [] }
}

export default (state = INITIAL_STATE, action: DataAction) => {
  switch (action.type) {
    case DataActionTypeKey.ADD_NEW_GRAPH:
      // DataSet.init(action.payload)
      DataSet.addGraph(action.payload)

      // const nodeList = extractSideBarTypeDataFromINodeList(
      //   action.payload.nodes,
      //   state.ignoreStd
      // )
      const nodeList = DataSet.getSideBarTypeData(
        state.nodeList,
        state.ignoreStd
      )
      VisNetwork.show(nodeList.visibleList)

      return {
        ...INITIAL_STATE,
        nodeList: {
          visibleList: nodeList.visibleList,
          invisibleList: nodeList.invisibleList
        }
      }
    case DataActionTypeKey.SHOW_NODE:
      VisNetwork.show(action.payload.id)

      if (action.payload.type === GraphType.PkgType.STD && state.ignoreStd) {
        return state
      }

      return {
        ignoreStd: state.ignoreStd,
        nodeList: show(state.nodeList, action.payload.id)
      }
    case DataActionTypeKey.HIDE_NODE:
      VisNetwork.hide(action.payload.id)

      return {
        ignoreStd: state.ignoreStd,
        nodeList: hide(state.nodeList, action.payload.id)
      }
    case DataActionTypeKey.EXPAND:
      const updatedState = expandNode(action.payload, state)
      VisNetwork.show(updatedState.nodeList.visibleList)

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

  return {
    ignoreStd: state.ignoreStd,
    nodeList: state.ignoreStd
      ? show(
          state.nodeList,
          _.filter(
            newlyShownNodeIDList,
            id => DataSet.getNode(id).type !== GraphType.PkgType.STD
          )
        )
      : show(state.nodeList, newlyShownNodeIDList)
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
