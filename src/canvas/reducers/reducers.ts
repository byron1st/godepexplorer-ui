import { combineReducers } from 'redux'

import uiReducers from './uiReducer'

export default combineReducers({
  uiState: uiReducers
})