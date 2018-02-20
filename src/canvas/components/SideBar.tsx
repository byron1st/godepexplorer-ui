import * as React from 'react'
import Resizable from 're-resizable'

export default class MenuBar extends React.Component<{width: number, updateWidth: (event: MouseEvent, direction: string, ref: HTMLElement, delta: { width: number, height: number })=>void}> {
  render () {
    return (
      <Resizable
        className='position-fixed bg-secondary'
        style={style.ResizableComp}
        size={{ height: '100%', width: this.props.width }}
        onResizeStop={this.props.updateWidth}
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