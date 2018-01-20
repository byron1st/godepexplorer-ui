import * as React from 'react'
import * as ReactDOM from 'react-dom'

class Container extends React.Component {
  render() {
    return (
      <h1>Hello, React!</h1>
    )
  }
}

ReactDOM.render(<Container />, document.getElementById("details"))