import * as React from 'react'
import Resizable from 're-resizable'

export default class MenuBar extends React.Component {
  state = {
    width: 300
  }

  updateWidth (event: MouseEvent, direction: string, ref: HTMLElement, delta: { width: number, height: number }) {
    this.setState({ width: this.state.width + delta.width })
  }

  render () {
    return (
      <Resizable
        className='position-fixed bg-light'
        style={style.ResizableComp}
        size={{ height: '100%', width: this.state.width }}
        onResizeStop={this.updateWidth.bind(this)}
        minWidth={300}
        maxWidth={800}
      >

      </Resizable>
    )
  }
}

const style = {
  ResizableComp: {
    zIndex: 1010,
    borderStyle: 'none outset none none'
  }
}