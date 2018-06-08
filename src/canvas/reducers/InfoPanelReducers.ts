import { DataAction, DataActionTypeKey } from '../actions'
import { ISelectedState } from './Type'

const INITIAL_STATE: ISelectedState = {
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
