import { State } from 'godeptypes'
import { DataAction, DataActionTypeKey } from '../actions'

const INITIAL_STATE: State.ISelectedState = {
  nodeList: [],
  edgeList: []
}

export default (state = INITIAL_STATE, action: DataAction) => {
  switch (action.type) {
    case DataActionTypeKey.SHOW_INFO:
      return action.payload
    default:
      return state
  }
}
