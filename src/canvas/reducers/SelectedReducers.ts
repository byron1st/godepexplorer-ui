import { getType } from 'typesafe-actions'
import * as _ from 'lodash'
import { State } from 'godeptypes'
import { DataAction, dataActions } from '../Actions'

const INITIAL_STATE: State.ISelectedState = {
  nodeList: [],
  edgeList: []
}

export default (state = INITIAL_STATE, action: DataAction) => {
  switch (action.type) {
    case getType(dataActions.select):
      return {
        nodeList: [...state.nodeList, ...action.payload.nodeList],
        edgeList: [...state.edgeList, ...action.payload.edgeList]
      }
    case getType(dataActions.deselect):
      return {
        nodeList: _.filter(
          state.nodeList,
          nodeID => !_.includes(action.payload.nodeList, nodeID)
        ),
        edgeList: _.filter(
          state.edgeList,
          edgeID => !_.includes(action.payload.edgeList, edgeID)
        )
      }
    default:
      return state
  }
}
