import * as _ from 'lodash'
import { ISelectedState } from './Type'
import { DataAction, DataActionTypeKey } from '../actions'

const INITIAL_STATE: ISelectedState = {
  nodeList: [],
  edgeList: []
}

export default (state = INITIAL_STATE, action: DataAction) => {
  switch (action.type) {
    case DataActionTypeKey.SELECT:
      return {
        nodeList: _.union(state.nodeList, action.payload.nodeList),
        edgeList: _.union(state.edgeList, action.payload.edgeList)
      }
    case DataActionTypeKey.DESELECT:
      return {
        nodeList: _.difference(state.nodeList, action.payload.nodeList),
        edgeList: _.difference(state.edgeList, action.payload.edgeList)
      }
    case DataActionTypeKey.SHOW_NODE:
    case DataActionTypeKey.HIDE_NODE:
      return INITIAL_STATE
    default:
      return state
  }
}
