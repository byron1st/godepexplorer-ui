import { combineReducers } from 'redux'
import { graphReducers, IGraphState } from './reducers/GraphReducers'
import { IUIState, uiReducers } from './reducers/UIReducers'
import { IDataStore, dataReducers } from './reducers/DataReducers'

export interface IRootState {
  readonly uiState: IUIState
  readonly graphState: IGraphState
  readonly data: IDataStore
}

export const rootReducers = combineReducers<IRootState>({
  graphState: graphReducers,
  uiState: uiReducers,
  data: dataReducers
})

export * from './reducers/UIReducers'
export * from './reducers/GraphReducers'
export * from './reducers/DataReducers'
