import Resizable from 're-resizable'
import * as React from 'react'
import { connect } from 'react-redux'
import { ISetGraph } from '../../../GlobalTypes'
import { uiActions } from '../../Actions'
import { IRootState } from '../../Reducers'
import InfoTableContainer from './InfoTableContainer'

interface IInfoPanelProps {
  height: number
  isNodeVisible: boolean
  isEdgeVisible: boolean
  sideBarWidth: number
  selectionSet: ISetGraph
  updateHeight: (newHeight: number) => any
  changeNodeVisible: () => any
  changeEdgeVisible: () => any
}

class InfoPanel extends React.Component<IInfoPanelProps> {
  constructor(props: IInfoPanelProps) {
    super(props)

    this.updateHeight = this.updateHeight.bind(this)
  }
  public render() {
    return (
      <Resizable
        // @ts-ignore
        // style에 position 어트리뷰트가 정의되어 있지 않아서 에러가 발생하지만,
        // position을 fixed로 override 해주어야, fixed-bottom 이 동작함.
        className="fixed-bottom bg-light"
        style={{ ...style.ResizableComp, paddingLeft: this.props.sideBarWidth }}
        size={{ width: '100%', height: this.props.height }}
        enable={resizeEnabled}
        onResizeStop={this.updateHeight}
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

  private updateHeight(
    event: MouseEvent,
    direction: string,
    ref: HTMLElement,
    delta: { width: number; height: number }
  ) {
    this.props.updateHeight(this.props.height + delta.height)
  }
}

const style = {
  ResizableComp: {
    borderStyle: 'outset none none none',
    overflowY: 'auto',
    position: 'fixed',
    zIndex: 1009
  }
}

const resizeEnabled = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: false,
  top: true,
  topLeft: false,
  topRight: false
}

function mapStateToProps(state: IRootState) {
  return {
    height: state.uiState.infoPanelHeight,
    isEdgeVisible: state.uiState.isEdgeVisible,
    isNodeVisible: state.uiState.isNodeVisible,
    selectionSet: state.graphState.selectionSet,
    sideBarWidth: state.uiState.sideBarWidth
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    changeEdgeVisible: () => {
      dispatch(uiActions.changeEdgeVisible())
    },
    changeNodeVisible: () => {
      dispatch(uiActions.changeNodeVisible())
    },
    updateHeight: (newHeight: number) => {
      dispatch(uiActions.updateHeight(newHeight))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPanel)
