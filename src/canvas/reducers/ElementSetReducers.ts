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
      return {
        edgeSet: { ...state.edgeSet, ...getNewNodeSet(action.payload.nodes) },
        nodeSet: { ...state.nodeSet, ...getNewEdgeSet(action.payload.edges) }
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

function getNewEdgeSet(edges: IEdge[]) {
  const initEdgeSet: IElementSet<IEdge> = {}

  return edges
    .filter(edge => edge.from !== edge.to)
    .reduce((accumulated, currentEdge) => {
      accumulated[currentEdge.id] = currentEdge
      return accumulated
    }, initEdgeSet)
}

function getNewNodeSet(nodes: INode[]) {
  const initNodeSet: IElementSet<INode> = {}

  return nodes.reduce((accumulated, currentNode) => {
    currentNode.isVisible = true
    accumulated[currentNode.id] = currentNode
    return accumulated
  }, initNodeSet)
}
