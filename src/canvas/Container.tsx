import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { rootReducers } from './Reducers'
import { Provider, connect } from 'react-redux'
import { createStore } from 'redux'
import Root from './components/Root'

class Container extends React.Component {
  render () {
    //@ts-ignore: window. ... for ReduxDevTool
    const store = createStore(rootReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    )
  }
}

//@ts-ignore: 'document' is working well.
ReactDOM.render(<Container />, document.getElementById("container"))