import { ipcRenderer } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import { IPCGetDep } from '../../IPCType'
import * as GraphType from '../graph/Type'
import { turnOffLoadingIndicator, addNewGraph } from '../actions'
import Canvas from './canvas/Canvas'
import InfoPanel from './infoPanel/InfoPanel'
import MenuBar from './menuBar/MenuBar'
import SideBar from './sideBar/SideBar'

interface IRootProps {
  turnOffLoadingIndicator: () => any
  addNewGraph: (newGraph: GraphType.IListGraph) => any
}

class Root extends React.Component<IRootProps> {
  constructor(props: IRootProps) {
    super(props)

    ipcRenderer.on(
      IPCGetDep.Response,
      (event: any, newGraph: GraphType.IListGraph) => {
        this.props.turnOffLoadingIndicator()

        if (newGraph) {
          this.props.addNewGraph(newGraph)
        }
      }
    )
  }

  public render() {
    return (
      // @ts-ignore
      // "WebkitUserSelect"이 string 타입을 가질 수 없다고 ts-error를 발생시킴.
      // 하지만 가질 수 있음.
      <div style={style}>
        <SideBar />
        <MenuBar appTitle="GoDepExplorer UI" />
        <InfoPanel />
        <Canvas />
      </div>
    )
  }
}

const style = { width: 'inherit', height: 'inherit', WebkitUserSelect: 'none' }

function mapDispatchToProps(dispatch: any) {
  return {
    turnOffLoadingIndicator: () => dispatch(turnOffLoadingIndicator()),
    addNewGraph: (newGraph: GraphType.IListGraph) => {
      dispatch(addNewGraph(newGraph))
    }
  }
}

export default connect(null, mapDispatchToProps)(Root)
