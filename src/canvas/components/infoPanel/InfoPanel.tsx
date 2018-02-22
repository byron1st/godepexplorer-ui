import * as React from 'react'
import { connect } from 'react-redux'
import Resizable from 're-resizable'
import { Graph } from '../../../GlobalTypes'
import { RootState } from '../../Reducers'
import { uiActions } from '../../Actions'
// import InfoTableContainer from './InfoTableContainer'

type InfoPanelProps = {
  height: number,
  isNodeVisible: boolean,
  isEdgeVisible: boolean,
  sideBarWidth: number,
  updateHeight: (newHeight: number) => any,
  changeNodeVisible: () => any,
  changeEdgeVisible: () => any
}

class InfoPanel extends React.Component<InfoPanelProps> {
  updateHeight (event: MouseEvent, direction: string, ref: HTMLElement, delta: { width: number, height: number }) {
    this.props.updateHeight(this.props.height + delta.height)
  }

  render () {
    return (
      <Resizable
        // @ts-ignore
        // style에 position 어트리뷰트가 정의되어 있지 않아서 에러가 발생하지만, 
        // position을 fixed로 override 해주어야, fixed-bottom 이 동작함.
        className='fixed-bottom bg-light'
        style={{...style.ResizableComp, paddingLeft: this.props.sideBarWidth}}
        size={{ width: '100%', height: this.props.height }}
        onResizeStop={this.updateHeight.bind(this)}
        minHeight={300}
        maxHeight={800}
      >
        {/* <InfoTableContainer data={this.props.graph.nodes} header='Nodes' key='nodes-info' />
        <InfoTableContainer data={this.props.graph.edges} header='Edges' key='edges-info' /> */}
      </Resizable>
    )
  }
}

const style = {
  ResizableComp: {
    zIndex: 1009,
    borderStyle: 'outset none none none',
    position: 'fixed',
    overflowY: 'scroll'
  }
}

function mapStateToProps (state: RootState) {
  return {
    height: state.uiState.infoPanelHeight,
    sideBarWidth: state.uiState.sideBarWidth,
    isNodeVisible: state.uiState.isNodeVisible,
    isEdgeVisible: state.uiState.isEdgeVisible
  }
}

function mapDispatchToProps (dispatch: any) {
  return {
    updateHeight: (newHeight: number) => {
      dispatch(uiActions.updateHeight(newHeight))
    },
    changeNodeVisible: () => {
      dispatch(uiActions.changeNodeVisible())
    },
    changeEdgeVisible: () => {
      dispatch(uiActions.changeEdgeVisible())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPanel)