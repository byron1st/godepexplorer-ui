import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import * as reducers from './Reducers'
import SideBar from './components/sideBar/SideBar'

class Container extends React.Component {
  render() {
    //@ts-ignore: window. ... for ReduxDevTool
    const store = createStore(reducers.rootReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    return (
      <Provider store={store}>
        <div>
          <SideBar />
        </div>
      </Provider>
    )
  }
}

//@ts-ignore: 'document' is working well.
ReactDOM.render(<Container />, document.getElementById("container"))