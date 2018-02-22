import { $call } from 'utility-types'
import { createAction } from 'typesafe-actions'

export const uiActions = {
  updateWidth: createAction('UPDATE_WIDTH', (newWidth: number) => ({
    type: 'UPDATE_WIDTH',
    payload: newWidth
  }))/*,
  updateHeight: createAction('UPDATE_HEIGHT', (newHeight: number) => ({
    type: 'UPDATE_HEIGHT',
    payload: newHeight
  })),
  changeNodeVisible: createAction('CHANGE_NODE_VISIBLE'),
  changeEdgeVisible: createAction('CHANGE_EDGE_VISIBLE')*/
}

const returnsOfActions = Object.values(uiActions).map($call)
export type UIAction = typeof returnsOfActions[number]
