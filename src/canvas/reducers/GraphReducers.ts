import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { graphActions, GraphAction } from '../Actions'
import { ElementSet, Node, Edge } from '../../GlobalTypes'
import { elementSetReducers } from './ElementSetReducers'

export type GraphState = {
  readonly elementSet: ElementSet
}

export const graphReducers = combineReducers<GraphState>({
  elementSet: elementSetReducers
})