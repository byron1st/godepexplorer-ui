import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { IEdge, IElementSet, INode, ISetGraph } from '../../GlobalTypes'
import { GraphAction, graphActions } from '../Actions'

const INITIAL_STATE: ISetGraph = {
  edgeSet: {},
  nodeSet: {}
}

export function elementSetReducers(state = INITIAL_STATE, action: GraphAction) {
  switch (action.type) {
    case getType(graphActions.updateGraph):
      const initNodeSet: IElementSet<INode> = {}
      const initEdgeSet: IElementSet<IEdge> = {}
      const newNodeSet = action.payload.nodes.reduce(
        (accumulated, currentNode) => {
          currentNode.isVisible = true
          accumulated[currentNode.id] = currentNode
          return accumulated
        },
        initNodeSet
      )
      const newEdgeSet = action.payload.edges.reduce(
        (accumulated, currentEdge) => {
          accumulated[currentEdge.id] = currentEdge
          return accumulated
        },
        initEdgeSet
      )
      return {
        edgeSet: { ...state.edgeSet, ...newEdgeSet },
        nodeSet: { ...state.nodeSet, ...newNodeSet }
      }
    case getType(graphActions.resetGraph):
      return INITIAL_STATE
    case getType(graphActions.changeSingleNodeVisible):
      const newSet = { ...state.nodeSet }
      newSet[action.payload.id] = {
        ...state.nodeSet[action.payload.id],
        isVisible: !state.nodeSet[action.payload.id].isVisible
      }
      return {
        edgeSet: state.edgeSet,
        nodeSet: newSet
      }
    default:
      return state
  }
}
