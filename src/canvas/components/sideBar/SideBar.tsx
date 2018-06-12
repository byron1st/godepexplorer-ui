import Resizable from 're-resizable'
import * as React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import * as StateType from '../../reducers/Type'
import { PkgType } from '../../graph/Type'
import { updateWidth } from '../../actions'
import DataSet from '../../graph/DataSet'
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
          <ViewConfig />
          <SideBarList
            header="Packages"
            listData={this.props.graphData.sideBarListData}
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

function isSameNodeList(
  prevNodeList: StateType.ISideBarTypeData,
  nextNodeList: StateType.ISideBarTypeData
): boolean {
  return (
    isSame(prevNodeList.visibleList, nextNodeList.visibleList) &&
    isSame(prevNodeList.invisibleList, nextNodeList.invisibleList)
  )
}

function isSame(prevList: string[], nextList: string[]): boolean {
  if (prevList.length !== nextList.length) {
    return false
  }

  return _.isEmpty(_.difference(prevList, nextList))
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
