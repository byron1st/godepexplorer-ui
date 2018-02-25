import { combineReducers } from 'redux'
import { uiReducers, UIState } from './reducers/UIReducers'
import { graphReducers, GraphState } from './reducers/GraphReducers'

export type RootState = {
  readonly uiState: UIState
  readonly graphState: GraphState
}

export const rootReducers = combineReducers<RootState>({
  uiState: uiReducers,
  graphState: graphReducers
})

export * from './reducers/UIReducers'
export * from './reducers/GraphReducers'
