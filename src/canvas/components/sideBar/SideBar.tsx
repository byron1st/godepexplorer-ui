import Resizable from 're-resizable'
import * as React from 'react'
import { connect } from 'react-redux'
import { INode, ISetGraph } from '../../../GlobalTypes'
import { uiActions } from '../../Actions'
import { IRootState } from '../../Reducers'
import { filterNodeVisibility } from '../../util'
import SideBarList from './SideBarList'
import ViewConfig from './ViewConfig'

interface ISideBarProps {
  width: number
  elementSet: ISetGraph
  selectionSet: ISetGraph
  isStdVisible: boolean
  isExtVisible: boolean
  updateWidth: (newWidth: number) => any
}

class SideBar extends React.Component<ISideBarProps> {
  constructor(props: ISideBarProps) {
    super(props)

    this.updateWidth = this.updateWidth.bind(this)
  }

  public render() {
    const visibleNodeList = Object.values(this.props.elementSet.nodeSet).filter(
      node =>
        filterNodeVisibility(
          node,
          this.props.isStdVisible,
          this.props.isExtVisible
        )
    )
    const invisibleNodeList = Object.values(
      this.props.elementSet.nodeSet
    ).filter(
      node =>
        !filterNodeVisibility(
          node,
          this.props.isStdVisible,
          this.props.isExtVisible
        )
    )
    return (
      <Resizable
        className="position-fixed fixed-top bg-secondary"
        style={{
          ...style.ResizableComp,
          overflowX: 'hidden',
          overflowY: 'auto'
        }}
        size={{ height: '100%', width: this.props.width }}
        enable={resizeEnabled}
        onResizeStop={this.updateWidth}
        minWidth={200}
        maxWidth={800}
      >
        <ViewConfig />
        <SideBarList
          header="Visible nodes"
          nodeList={visibleNodeList}
          selectedNodeSet={this.props.selectionSet.nodeSet}
          isClickable={true}
        />
        <SideBarList
          header="Invisible nodes"
          nodeList={invisibleNodeList}
          selectedNodeSet={this.props.selectionSet.nodeSet}
          isClickable={false}
        />
      </Resizable>
    )
  }

  private updateWidth(
    event: MouseEvent,
    direction: string,
    ref: HTMLElement,
    delta: { width: number; height: number }
  ) {
    this.props.updateWidth(delta.width + this.props.width)
  }
}

const style = {
  ResizableComp: {
    borderStyle: 'none outset none none',
    padding: '66px 10px 10px 10px',
    zIndex: 1010
  }
}

const resizeEnabled = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: true,
  top: false,
  topLeft: false,
  topRight: false
}

function mapStateToProps(state: IRootState) {
  return {
    elementSet: state.graphState.elementSet,
    isExtVisible: state.uiState.isExtVisible,
    isStdVisible: state.uiState.isStdVisible,
    selectionSet: state.graphState.selectionSet,
    width: state.uiState.sideBarWidth
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    updateWidth: (newWidth: number) => {
      dispatch(uiActions.updateWidth(newWidth))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
