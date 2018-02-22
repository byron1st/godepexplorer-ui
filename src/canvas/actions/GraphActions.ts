import { $call } from 'utility-types'
import { createAction } from 'typesafe-actions'
import { Graph } from '../../GlobalTypes'

export const graphActions = {
  updateGraph: createAction('UPDATE_GRAPH', (newGraph: Graph) => ({
    type: 'UPDATE_GRAPH',
    payload: newGraph
  })),
  selectElement: createAction('SELECT_ELEMENT', (selectedGraph: Graph) => ({
    type: 'SELECT_ELEMENT',
    payload: selectedGraph
  }))
}

const returnsOfActions = Object.values(graphActions).map($call)
export type GraphAction = typeof returnsOfActions[number]