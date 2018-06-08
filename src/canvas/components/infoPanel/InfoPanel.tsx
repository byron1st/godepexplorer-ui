import Resizable from 're-resizable'
import * as React from 'react'
import { connect } from 'react-redux'
import * as StateType from '../../reducers/Type'
import * as GraphType from '../../graph/Type'
import {
  changeEdgeVisible,
  changeNodeVisible,
  updateHeight
} from '../../actions'
import InfoTableContainer from './InfoTableContainer'
import DataSet from '../../graph/DataSet'

interface IInfoPanelProps {
  height: number
  isNodeVisible: boolean
  isEdgeVisible: boolean
  sideBarWidth: number
  infoPanelData: StateType.ISelectedState
  updateHeight: (newHeight: number) => any
  changeNodeVisible: () => any
  changeEdgeVisible: () => any
}

class InfoPanel extends React.Component<IInfoPanelProps> {
  constructor(props: IInfoPanelProps) {
    super(props)

    this.updateHeight = this.updateHeight.bind(this)
  }

  public componentDidUpdate() {
    // @ts-ignore
    $(() => {
      // @ts-ignore
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  public render() {
    const nodeList: GraphType.INode[] = this.props.infoPanelData.nodeList.map(
      id => DataSet.getNode(id)
    )
    const edgeList: GraphType.IEdge[] = this.props.infoPanelData.edgeList.map(
      id => DataSet.getEdge(id)
    )

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
        <div style={style.ContentContainer}>
          <InfoTableContainer
            elementList={nodeList}
            header="Nodes"
            isVisible={this.props.isNodeVisible}
            isNode={true}
            changeVisibility={this.props.changeNodeVisible}
          />
          <InfoTableContainer
            elementList={edgeList}
            header="Edges"
            isVisible={this.props.isEdgeVisible}
            isNode={false}
            changeVisibility={this.props.changeEdgeVisible}
          />
        </div>
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
  },
  ContentContainer: {
    marginLeft: '10px',
    marginRight: '10px'
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

function mapStateToProps(state: StateType.IRootState) {
  return {
    height: state.ui.infoPanelHeight,
    isEdgeVisible: state.ui.isEdgeVisible,
    isNodeVisible: state.ui.isNodeVisible,
    sideBarWidth: state.ui.sideBarWidth,
    infoPanelData: state.data.infoPanelData
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    changeEdgeVisible: () => {
      dispatch(changeEdgeVisible())
    },
    changeNodeVisible: () => {
      dispatch(changeNodeVisible())
    },
    updateHeight: (newHeight: number) => {
      dispatch(updateHeight(newHeight))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPanel)
