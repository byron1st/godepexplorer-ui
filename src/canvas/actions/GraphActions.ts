import { createAction } from 'typesafe-actions'
import { $call } from 'utility-types'
import { INode, IListGraph, ISetGraph } from '../../GlobalTypes'

export const graphActions = {
  updateGraph: createAction('UPDATE_GRAPH', (newGraph: IListGraph) => ({
    type: 'UPDATE_GRAPH',
    payload: newGraph
  })),
  selectElement: createAction('SELECT_ELEMENT', (selectionSet: ISetGraph) => ({
    type: 'SELECT_ELEMENT',
    payload: selectionSet
  })),
  resetGraph: createAction('RESET_GRAPH'),
  changeSingleNodeVisible: createAction(
    'CHANGE_SINGLE_NODE_VISIBLE',
    (node: INode) => ({
      type: 'CHANGE_SINGLE_NODE_VISIBLE',
      payload: node
    })
  )
}

const returnsOfActions = Object.values(graphActions).map($call)
export type GraphAction = typeof returnsOfActions[number]
