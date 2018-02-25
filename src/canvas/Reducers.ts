import { combineReducers } from 'redux'
import { graphReducers, IGraphState } from './reducers/GraphReducers'
import { IUIState, uiReducers } from './reducers/UIReducers'

export interface IRootState {
  readonly uiState: IUIState
  readonly graphState: IGraphState
}

export const rootReducers = combineReducers<IRootState>({
  graphState: graphReducers,
  uiState: uiReducers
})

export * from './reducers/UIReducers'
export * from './reducers/GraphReducers'
