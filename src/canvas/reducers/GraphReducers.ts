import * as _ from 'lodash'
import { IGraphState, ISideBarTypeData, ISideBarData } from './Type'
import * as GraphType from '../graph/Type'
import { DataActionTypeKey, DataAction } from '../actions'
import DataSet from '../graph/DataSet'
import VisNetwork from '../graph/VisNetwork'

const INITIAL_STATE: IGraphState = {
  ignoreStd: true, // TODO: Specific to godepexplorer
  data: {
    nor: { visibleList: [], invisibleList: [] },
    ext: { visibleList: [], invisibleList: [] },
    std: { visibleList: [], invisibleList: [] }
  }
}

export default (state = INITIAL_STATE, action: DataAction) => {
  switch (action.type) {
    case DataActionTypeKey.INIT_SIDEBARDATA:
      DataSet.init(action.payload)

      const newGraph = buildSideBarData(action.payload)
      VisNetwork.show(getVisibleList(newGraph))

      return {
        ...INITIAL_STATE,
        data: newGraph
      }
    case DataActionTypeKey.SHOW_NODE:
      VisNetwork.show(action.payload.id)

      if (action.payload.type === GraphType.PkgType.STD && state.ignoreStd) {
        return state
      }

      return {
        ignoreStd: state.ignoreStd,
        data: {
          ...state.data,
          [action.payload.type]: show(
            state.data[action.payload.type],
            action.payload.id
          )
        }
      }
    case DataActionTypeKey.HIDE_NODE:
      VisNetwork.hide(action.payload.id)

      return {
        ignoreStd: state.ignoreStd,
        data: {
          ...state.data,
          [action.payload.type]: hide(
            state.data[action.payload.type],
            action.payload.id
          )
        }
      }
    case DataActionTypeKey.EXPAND:
      const updatedState = expandNode(action.payload, state)
      VisNetwork.show(getVisibleList(updatedState.data))

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

function getVisibleList(dataSet: ISideBarData) {
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

// TODO: Specific to godepexplorer
function expandNode(nodeID: string, state: IGraphState) {
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
    ? state.data.std
    : show(
        state.data.std,
        getNodeIDListFilteredByPkgType(
          connectedNodeIDList,
          GraphType.PkgType.STD
        )
      )

  return {
    ignoreStd: state.ignoreStd,
    data: {
      nor: show(
        state.data.nor,
        getNodeIDListFilteredByPkgType(
          connectedNodeIDList,
          GraphType.PkgType.NOR
        )
      ),
      ext: show(
        state.data.ext,
        getNodeIDListFilteredByPkgType(
          connectedNodeIDList,
          GraphType.PkgType.EXT
        )
      ),
      std: stdSet
    }
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

function buildSideBarData(graph: GraphType.IListGraph): ISideBarData {
  const sideBarState: ISideBarData = {
    nor: {
      visibleList: [],
      invisibleList: []
    },
    ext: {
      visibleList: [],
      invisibleList: []
    },
    std: {
      visibleList: [],
      invisibleList: []
    }
  }

  graph.nodes.forEach(node => {
    switch (node.meta.pkgType) {
      case GraphType.PkgType.NOR:
        sideBarState.nor.visibleList.push(node.id)
        break
      case GraphType.PkgType.EXT:
        sideBarState.ext.invisibleList.push(node.id)
        break
      case GraphType.PkgType.STD:
        sideBarState.std.invisibleList.push(node.id)
        break
    }
  })

  sideBarState.nor.visibleList.sort(sortByPkgPath.bind(this))
  sideBarState.ext.invisibleList.sort(sortByPkgPath.bind(this))
  sideBarState.std.invisibleList.sort(sortByPkgPath.bind(this))

  return sideBarState
}
