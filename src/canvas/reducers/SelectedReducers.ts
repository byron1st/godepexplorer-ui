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
        nodeList: _.union(state.nodeList, action.payload.nodeList),
        edgeList: _.union(state.edgeList, action.payload.edgeList)
      }
    case getType(dataActions.deselect):
      return {
        nodeList: _.reject(state.nodeList, nodeID =>
          _.includes(action.payload.nodeList, nodeID)
        ),
        edgeList: _.reject(state.edgeList, edgeID =>
          _.includes(action.payload.edgeList, edgeID)
        )
      }
    default:
      return state
  }
}
