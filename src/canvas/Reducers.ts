import { combineReducers } from 'redux'
import * as uiReducers from './reducers/UIReducers'

export type RootState = {
  readonly uiState: uiReducers.UIState
}

export const rootReducers = combineReducers<RootState>({
  uiState: uiReducers.uiReducers
})
export * from './reducers/UIReducers'