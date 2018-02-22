import * as React from 'react'
import { connect } from 'react-redux'
import Resizable from 're-resizable'
import { uiActions } from '../../Actions'
import { RootState } from'../../Reducers'


interface SideBarProps {
  width: number
  updateWidth: (newWidth: number) => any
}

class SideBar extends React.Component<SideBarProps> {
  updateWidth (event: MouseEvent, direction: string, ref: HTMLElement, delta: { width: number, height: number }) {
    this.props.updateWidth(delta.width + this.props.width)
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

function mapStateToProps (state: RootState) {
  return {
    width: state.uiState.sideBarWidth
  }
}

function mapDispatchToProps (dispatch: any) {
  return {
    updateWidth: (newWidth: number) => {
      dispatch(uiActions.updateWidth(newWidth))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)