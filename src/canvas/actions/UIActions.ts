import { createAction } from 'typesafe-actions'
import { $call } from 'utility-types'

export const uiActions = {
  updateWidth: createAction('UPDATE_WIDTH', (newWidth: number) => ({
    type: 'UPDATE_WIDTH',
    payload: newWidth
  })),
  updateHeight: createAction('UPDATE_HEIGHT', (newHeight: number) => ({
    type: 'UPDATE_HEIGHT',
    payload: newHeight
  })),
  changeNodeVisible: createAction('CHANGE_NODE_VISIBLE'),
  changeEdgeVisible: createAction('CHANGE_EDGE_VISIBLE'),
  turnOnLoadingIndicator: createAction(
    'TURNON_LOADING_INDICATOR',
    (packagePath: string) => ({
      type: 'TURNON_LOADING_INDICATOR',
      payload: packagePath
    })
  ),
  turnOffLoadingIndicator: createAction('TURNOFF_LOADING_INDICATOR'),
  changeStdVisible: createAction('CHANGE_STD_VISIBLE'),
  changeExtVisible: createAction('CHANGE_EXT_VISIBLE')
}

const returnsOfActions = Object.values(uiActions).map($call)
export type UIAction = typeof returnsOfActions[number]
