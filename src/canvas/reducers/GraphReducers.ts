import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { graphActions, GraphAction } from '../Actions'
import { ElementSet, Graph } from '../../GlobalTypes'
import { elementSetReducers } from './ElementSetReducers'

export type GraphState = {
  readonly elementSet: ElementSet,
  readonly infoPanelList: Graph
}

const INITIAL_GRAPH: Graph = {
  nodes: [],
  edges: []
}

export const graphReducers = combineReducers<GraphState>({
  elementSet: elementSetReducers,
  infoPanelList: (state = INITIAL_GRAPH, action: GraphAction) => {
    switch(action.type) {
      case getType(graphActions.selectElement):
        return action.payload
      default:
        return state
    }
  }
})