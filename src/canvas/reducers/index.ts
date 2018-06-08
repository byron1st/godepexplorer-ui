import { combineReducers, createStore } from 'redux'
import { IRootState } from './Type'
import { uiReducers } from './UIReducers'
import { dataReducers } from './DataReducers'

const rootReducers = combineReducers<IRootState>({
  ui: uiReducers,
  data: dataReducers
})

export default createStore(
  rootReducers,
  // @ts-ignore: window. ... for ReduxDevTool
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
    // @ts-ignore: window. ... for ReduxDevTool
    window.__REDUX_DEVTOOLS_EXTENSION__()
)
