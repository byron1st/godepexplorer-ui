import { getType } from 'typesafe-actions'
import { State } from 'godeptypes'
import { DataAction, dataActions } from '../Actions_deprecated'

const INITIAL_STATE: State.ISelectedState = {
  nodeList: [],
  edgeList: []
}

export default (state = INITIAL_STATE, action: DataAction) => {
  switch (action.type) {
    case getType(dataActions.showInfo):
      return action.payload
    default:
      return state
  }
}
