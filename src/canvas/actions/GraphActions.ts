import { $call } from 'utility-types'
import { createAction } from 'typesafe-actions'
import { ListGraph, SetGraph, Node } from '../../GlobalTypes'

export const graphActions = {
  updateGraph: createAction('UPDATE_GRAPH', (newGraph: ListGraph) => ({
    type: 'UPDATE_GRAPH',
    payload: newGraph
  })),
  selectElement: createAction('SELECT_ELEMENT', (selectionSet: SetGraph) => ({
    type: 'SELECT_ELEMENT',
    payload: selectionSet
  })),
  resetGraph: createAction('RESET_GRAPH'),
  changeSingleNodeVisible: createAction('CHANGE_SINGLE_NODE_VISIBLE', (node: Node) => ({
    type: 'CHANGE_SINGLE_NODE_VISIBLE',
    payload: node
  }))
}

const returnsOfActions = Object.values(graphActions).map($call)
export type GraphAction = typeof returnsOfActions[number]