import * as React from 'react'
import { connect } from 'react-redux'
import Resizable from 're-resizable'
import { uiActions } from '../../Actions'
import { RootState } from'../../Reducers'
import { ElementSet } from '../../../GlobalTypes'
import SideBarList from './SideBarList'

interface SideBarProps {
  width: number
  elementSet: ElementSet
  selectionSet: ElementSet
  updateWidth: (newWidth: number) => any
}

class SideBar extends React.Component<SideBarProps> {
  updateWidth (event: MouseEvent, direction: string, ref: HTMLElement, delta: { width: number, height: number }) {
    this.props.updateWidth(delta.width + this.props.width)
  }

  render () {
    return (
      <Resizable
        className='position-fixed fixed-top bg-secondary'
        style={{ ...style.ResizableComp, overflowY: 'auto', overflowX: 'hidden' }}
        size={{ height: '100%', width: this.props.width }}
        enable={resizeEnabled}
        onResizeStop={this.updateWidth.bind(this)}
        minWidth={200}
        maxWidth={800}
      >
        <SideBarList header='Nodes' nodeSet={this.props.elementSet.nodeSet} selectedNodeSet={this.props.selectionSet.nodeSet} />
      </Resizable>
    )
  }
}

const style = {
  ResizableComp: {
    zIndex: 1010,
    borderStyle: 'none outset none none',
    padding: '66px 10px 10px 10px'
  }
}

const resizeEnabled = { top:false, right:true, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }

function mapStateToProps (state: RootState) {
  return {
    width: state.uiState.sideBarWidth,
    elementSet: state.graphState.elementSet,
    selectionSet: state.graphState.selectionSet
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
