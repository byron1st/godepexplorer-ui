import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { graphActions, GraphAction } from '../Actions'
import { SetGraph } from '../../GlobalTypes'
import { elementSetReducers } from './ElementSetReducers'

export type GraphState = {
  readonly elementSet: SetGraph
  readonly selectionSet: SetGraph
}

const INITIAL_SELECTIONSET: SetGraph = {
  nodeSet: {},
  edgeSet: {}
}

export const graphReducers = combineReducers<GraphState>({
  elementSet: elementSetReducers,
  selectionSet: (state = INITIAL_SELECTIONSET, action: GraphAction) => {
    switch (action.type) {
      case getType(graphActions.selectElement):
        return action.payload
      default:
        return state
    }
  }
})
