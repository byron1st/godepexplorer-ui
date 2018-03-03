import Resizable from 're-resizable'
import * as React from 'react'
import { connect } from 'react-redux'
import { State } from 'godeptypes'
import { uiActions } from '../../Actions'
import SideBarList from './SideBarList'
import ViewConfig from './ViewConfig'

interface ISideBarProps {
  width: number
  isStdVisible: boolean
  isExtVisible: boolean
  sideBarData: State.ISideBarState
  selected: State.ISelectedState
  updateWidth: (newWidth: number) => any
}

class SideBar extends React.Component<ISideBarProps> {
  constructor(props: ISideBarProps) {
    super(props)

    this.updateWidth = this.updateWidth.bind(this)
  }

  public render() {
    const selectedSet = this.props.selected.nodeList.reduce(
      (accumulated: { [key: string]: boolean }, current) => {
        accumulated[current] = true
        return accumulated
      },
      {}
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
        {/* <ViewConfig /> */}
        <SideBarList
          header="Visible normal packages"
          nodeIDList={this.props.sideBarData.nor.visibleList}
          isVisible={true}
          isClickable={true}
          selectedSet={selectedSet}
        />
        <SideBarList
          header="Invisible normal packages"
          nodeIDList={this.props.sideBarData.nor.invisibleList}
          isVisible={false}
          isClickable={false}
          selectedSet={selectedSet}
        />
        <SideBarList
          header="Visible external packages"
          nodeIDList={this.props.sideBarData.ext.visibleList}
          isVisible={true}
          isClickable={true}
          selectedSet={selectedSet}
        />
        <SideBarList
          header="Invisible external packages"
          nodeIDList={this.props.sideBarData.ext.invisibleList}
          isVisible={false}
          isClickable={false}
          selectedSet={selectedSet}
        />
        <SideBarList
          header="Visible standard packages"
          nodeIDList={this.props.sideBarData.std.visibleList}
          isVisible={true}
          isClickable={true}
          selectedSet={selectedSet}
        />
        <SideBarList
          header="Invisible standard packages"
          nodeIDList={this.props.sideBarData.std.invisibleList}
          isVisible={false}
          isClickable={false}
          selectedSet={selectedSet}
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

function mapStateToProps(state: State.IRootState) {
  return {
    isExtVisible: state.ui.isExtVisible,
    isStdVisible: state.ui.isStdVisible,
    width: state.ui.sideBarWidth,
    sideBarData: state.data.sideBarData,
    selected: state.data.selected
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
