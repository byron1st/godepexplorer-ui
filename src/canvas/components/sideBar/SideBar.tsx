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

interface ISideBarState {
  nor: StateType.ISideBarTypeData
  ext: StateType.ISideBarTypeData
  std: StateType.ISideBarTypeData
  prevNodeList: StateType.ISideBarTypeData
}

class SideBar extends React.Component<ISideBarProps, ISideBarState> {
  public static getDerivedStateFromProps(
    nextProps: ISideBarProps,
    prevState: ISideBarState
  ): ISideBarState {
    const prevNodeList = prevState.prevNodeList
    const nextNodeList = nextProps.graphData.nodeList

    if (prevNodeList) {
      if (isSameNodeList(prevNodeList, nextNodeList)) {
        return null
      } else {
        return SideBar.setNewSideBar(nextProps.graphData.nodeList)
      }
    } else {
      return SideBar.setNewSideBar(nextProps.graphData.nodeList)
    }
  }

  private static setNewSideBar(
    nextNodeList: StateType.ISideBarTypeData
  ): ISideBarState {
    const sideBarNextState: ISideBarState = {
      nor: { visibleList: [], invisibleList: [] },
      ext: { visibleList: [], invisibleList: [] },
      std: { visibleList: [], invisibleList: [] },
      prevNodeList: { visibleList: [], invisibleList: [] }
    }

    nextNodeList.visibleList.forEach(nodeID => {
      const type = DataSet.getNode(nodeID).type
      switch (type) {
        case PkgType.NOR:
          sideBarNextState.nor.visibleList.push(nodeID)
          break
        case PkgType.EXT:
          sideBarNextState.ext.visibleList.push(nodeID)
          break
        case PkgType.STD:
          sideBarNextState.std.visibleList.push(nodeID)
          break
      }
    })

    nextNodeList.invisibleList.forEach(nodeID => {
      const type = DataSet.getNode(nodeID).type
      switch (type) {
        case PkgType.NOR:
          sideBarNextState.nor.invisibleList.push(nodeID)
          break
        case PkgType.EXT:
          sideBarNextState.ext.invisibleList.push(nodeID)
          break
        case PkgType.STD:
          sideBarNextState.std.invisibleList.push(nodeID)
          break
      }
    })

    const sortByPkgPath = (prev: string, next: string) =>
      DataSet.getNode(prev).meta.pkgPath <= DataSet.getNode(next).meta.pkgPath
        ? -1
        : 1

    _.values(sideBarNextState).forEach(typeLists =>
      _.values(typeLists).forEach(list => list.sort(sortByPkgPath))
    )

    sideBarNextState.prevNodeList = nextNodeList

    return sideBarNextState
  }

  constructor(props: ISideBarProps) {
    super(props)

    this.state = {
      nor: { visibleList: [], invisibleList: [] },
      ext: { visibleList: [], invisibleList: [] },
      std: { visibleList: [], invisibleList: [] },
      prevNodeList: { visibleList: [], invisibleList: [] }
    }

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
            header="Normal packages"
            visibleList={this.state.nor.visibleList}
            invisibleList={this.state.nor.invisibleList}
            selectedSet={selectedSet}
            selectedNodeList={this.props.selected.nodeList}
          />
          <SideBarList
            header="External packages"
            visibleList={this.state.ext.visibleList}
            invisibleList={this.state.ext.invisibleList}
            selectedSet={selectedSet}
            selectedNodeList={this.props.selected.nodeList}
          />
          <SideBarList
            header="Standard packages"
            visibleList={this.state.std.visibleList}
            invisibleList={this.state.std.invisibleList}
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
