import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { graphActions, GraphAction } from '../Actions'
import { Node, Edge } from '../../GlobalTypes'

export type ElementSetState = {
  readonly nodeSet: { [ID: string]: Node }
  readonly edgeSet: { [ID: string]: Edge }
}

const INITIAL_STATE: ElementSetState = {
  nodeSet: {},
  edgeSet: {}
}

export const elementSetReducers = (state = INITIAL_STATE, action: GraphAction) => {
  switch(action.type) {
    case getType(graphActions.updateGraph):
      let initNodeSet: {[ID: string]: Node} = {}
      let initEdgeSet: {[ID: string]: Edge} = {}
      const newNodeSet = action.payload.nodes.reduce((accumulated, currentNode) => {
        accumulated[currentNode.id] = currentNode
        return accumulated
      }, initNodeSet)
      const newEdgeSet = action.payload.edges.reduce((accumulated, currentEdge) => {
        accumulated[currentEdge.id] = currentEdge
        return accumulated
      }, initEdgeSet)
      return {
        nodeSet: { ...state.nodeSet, ...newNodeSet },
        edgeSet: { ...state.edgeSet, ...newEdgeSet }
      }
    default:
      return state
  }
}