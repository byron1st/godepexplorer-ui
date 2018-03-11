import { createAction } from 'typesafe-actions'
import { $call } from 'utility-types'
import { State, Graph } from 'godeptypes'

export const dataActions = {
  initSideBarData: createAction(
    'INIT_SIDEBARDATA',
    (initSideBarState: State.ISideBarState) => ({
      type: 'INIT_SIDEBARDATA',
      payload: initSideBarState
    })
  ),
  changeVisibility: createAction(
    'CHANGE_VISIBILITY',
    (id: string, toShow: boolean, pkgType: Graph.PkgType) => ({
      type: 'CHANGE_VISIBILITY',
      payload: { id, toShow, pkgType }
    })
  ),
  select: createAction('SELECT', (selected: State.ISelectedState) => ({
    type: 'SELECT',
    payload: selected
  })),
  deselect: createAction('DESELECT', (deselected: State.ISelectedState) => ({
    type: 'DESELECT',
    payload: deselected
  }))
}

const returnsOfActions = Object.values(dataActions).map($call)
export type DataAction = typeof returnsOfActions[number]
