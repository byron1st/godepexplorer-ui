import { createAction } from 'typesafe-actions'
import { $call } from 'utility-types'
import { State, Graph } from 'godeptypes'

export const dataActions = {
  initSideBarData: createAction(
    'INIT_SIDEBARDATA',
    (initSideBarState: State.ISideBarData) => ({
      type: 'INIT_SIDEBARDATA',
      payload: initSideBarState
    })
  ),
  showNode: createAction('SHOW_NODE', (id: string, pkgType: Graph.PkgType) => ({
    type: 'SHOW_NODE',
    payload: { id, pkgType }
  })),
  hideNode: createAction('HIDE_NODE', (id: string, pkgType: Graph.PkgType) => ({
    type: 'HIDE_NODE',
    payload: { id, pkgType }
  })),
  select: createAction('SELECT', (selected: State.ISelectedState) => ({
    type: 'SELECT',
    payload: selected
  })),
  deselect: createAction('DESELECT', (deselected: State.ISelectedState) => ({
    type: 'DESELECT',
    payload: deselected
  })),
  expand: createAction('EXPAND', (nodeID: string) => ({
    type: 'EXPAND',
    payload: nodeID
  }))
}

const returnsOfActions = Object.values(dataActions).map($call)
export type DataAction = typeof returnsOfActions[number]
