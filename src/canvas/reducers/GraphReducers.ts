import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { ISetGraph } from '../../GlobalTypes'
import { GraphAction, graphActions } from '../Actions'
import { elementSetReducers } from './ElementSetReducers'

export interface IGraphState {
  readonly elementSet: ISetGraph
  readonly selectionSet: ISetGraph
}

const INITIAL_SELECTIONSET: ISetGraph = {
  edgeSet: {},
  nodeSet: {}
}

export const graphReducers = combineReducers<IGraphState>({
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
