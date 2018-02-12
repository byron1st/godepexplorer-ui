import * as React from 'react'
import * as ReactDOM from 'react-dom'

class Container extends React.Component {
  render() {
    return <h1>Hello World!</h1>
  }
}

const style = {
}

ReactDOM.render(<Container />, document.getElementById("container"))