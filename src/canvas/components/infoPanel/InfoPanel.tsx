import * as React from 'react'
import { connect } from 'react-redux'
import Resizable from 're-resizable'
import { SetGraph } from '../../../GlobalTypes'
import { RootState } from '../../Reducers'
import { uiActions } from '../../Actions'
import InfoTableContainer from './InfoTableContainer'

type InfoPanelProps = {
  height: number
  isNodeVisible: boolean
  isEdgeVisible: boolean
  sideBarWidth: number
  selectionSet: SetGraph
  updateHeight: (newHeight: number) => any
  changeNodeVisible: () => any
  changeEdgeVisible: () => any
}

class InfoPanel extends React.Component<InfoPanelProps> {
  updateHeight(
    event: MouseEvent,
    direction: string,
    ref: HTMLElement,
    delta: { width: number; height: number }
  ) {
    this.props.updateHeight(this.props.height + delta.height)
  }

  render() {
    return (
      <Resizable
        // @ts-ignore
        // style에 position 어트리뷰트가 정의되어 있지 않아서 에러가 발생하지만,
        // position을 fixed로 override 해주어야, fixed-bottom 이 동작함.
        className="fixed-bottom bg-light"
        style={{ ...style.ResizableComp, paddingLeft: this.props.sideBarWidth }}
        size={{ width: '100%', height: this.props.height }}
        enable={resizeEnabled}
        onResizeStop={this.updateHeight.bind(this)}
        minHeight={200}
        maxHeight={800}
      >
        <InfoTableContainer
          elementSet={this.props.selectionSet.nodeSet}
          header="Nodes"
          isVisible={this.props.isNodeVisible}
          changeVisibility={this.props.changeNodeVisible}
        />
        <InfoTableContainer
          elementSet={this.props.selectionSet.edgeSet}
          header="Edges"
          isVisible={this.props.isEdgeVisible}
          changeVisibility={this.props.changeEdgeVisible}
        />
      </Resizable>
    )
  }
}

const style = {
  ResizableComp: {
    zIndex: 1009,
    borderStyle: 'outset none none none',
    position: 'fixed',
    overflowY: 'auto'
  }
}

const resizeEnabled = {
  top: true,
  right: false,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false
}

function mapStateToProps(state: RootState) {
  return {
    height: state.uiState.infoPanelHeight,
    sideBarWidth: state.uiState.sideBarWidth,
    isNodeVisible: state.uiState.isNodeVisible,
    isEdgeVisible: state.uiState.isEdgeVisible,
    selectionSet: state.graphState.selectionSet
  }
}

function mapDispatchToProps(dispatch: any) {
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
