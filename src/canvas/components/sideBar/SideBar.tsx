import Resizable from 're-resizable'
import * as React from 'react'
import { connect } from 'react-redux'
import * as StateType from '../../reducers/Type'
import { updateWidth } from '../../actions'
import SideBarList from './SideBarList'
import ViewConfig from './ViewConfig'

interface ISideBarProps {
  width: number
  graphData: StateType.IGraphState
  selected: StateType.ISelectedState
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
        style={style.ResizableComp}
        size={{ height: '100%', width: this.props.width }}
        enable={resizeEnabled}
        onResizeStop={this.updateWidth}
        minWidth={200}
        maxWidth={800}
      >
        <div style={{ ...style.ContentContainer, overflow: 'auto' }}>
          {/* TODO: vpViewConfig */}
          <ViewConfig />
          {/* ************ */}
          <SideBarList
            header="Normal packages"
            visibleList={this.props.graphData.data.nor.visibleList}
            invisibleList={this.props.graphData.data.nor.invisibleList}
            selectedSet={selectedSet}
            selectedNodeList={this.props.selected.nodeList}
          />
          <SideBarList
            header="External packages"
            visibleList={this.props.graphData.data.ext.visibleList}
            invisibleList={this.props.graphData.data.ext.invisibleList}
            selectedSet={selectedSet}
            selectedNodeList={this.props.selected.nodeList}
          />
          <SideBarList
            header="Standard packages"
            visibleList={this.props.graphData.data.std.visibleList}
            invisibleList={this.props.graphData.data.std.invisibleList}
            selectedSet={selectedSet}
            selectedNodeList={this.props.selected.nodeList}
          />
        </div>
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
  },
  ContentContainer: {
    height: '100%'
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

function mapStateToProps(state: StateType.IRootState) {
  return {
    width: state.ui.sideBarWidth,
    graphData: state.data.graphData,
    selected: state.data.selected
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    updateWidth: (newWidth: number) => {
      dispatch(updateWidth(newWidth))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
