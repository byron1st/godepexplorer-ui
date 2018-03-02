import { createAction } from 'typesafe-actions'
import { $call } from 'utility-types'
import { ISideBarElement } from '../../GlobalTypes'

export const dataActions = {
  initNormalList: createAction(
    'INIT_NORMAL_LIST',
    (elementList: ISideBarElement[]) => ({
      type: 'INIT_NORMAL_LIST',
      payload: elementList
    })
  ),
  displayNormal: createAction('DISPLAY_NORMAL', (element: ISideBarElement) => ({
    type: 'DISPLAY_NORMAL',
    payload: element
  })),
  hideNormal: createAction('HIDE_NORMAL', (element: ISideBarElement) => ({
    type: 'HIDE_NORMAL',
    payload: element
  }))
}

const returnsOfActions = Object.values(dataActions).map($call)
export type DataAction = typeof returnsOfActions[number]
