import * as React from 'react'
import { connect } from 'react-redux'
import Resizable from 're-resizable'
import { updateSideBarWidth } from '../actions/actions'

// interface SideBarProps {
//   width: number
//   updateWidth: (event: MouseEvent, direction: string, ref: HTMLElement, delta: { width: number, height: number }) => void
// }

class SideBar extends React.Component {
  updateWidth (event: MouseEvent, direction: string, ref: HTMLElement, delta: { width: number, height: number }) {
    this.props.updateWidth(delta + this.props.width)
  }

  render () {
    return (
      <Resizable
        className='position-fixed bg-secondary'
        style={style.ResizableComp}
        size={{ height: '100%', width: this.props.width }}
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

function mapStateToProps (state: any) {
  return {
    width: state.uiState.sideBarWidth
  }
}

function mapDispatchToProps (dispatch: any) {
  return {
    updateWidth: (newWidth: number) => {
      dispatch(updateSideBarWidth(newWidth))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)