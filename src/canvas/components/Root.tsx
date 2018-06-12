import { ipcRenderer } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import { IPCGetDep } from '../../IPCType'
import * as GraphType from '../graph/Type'
import {
  turnOffLoadingIndicator,
  togglePkgImported,
  addNewGraph
} from '../actions'
import Canvas from './canvas/Canvas'
import InfoPanel from './infoPanel/InfoPanel'
import MenuBar from './menuBar/MenuBar'
import SideBar from './sideBar/SideBar'

interface IRootProps {
  turnOffLoadingIndicator: () => any
  addNewGraph: (newGraph: GraphType.IListGraph) => any
  togglePkgImported: () => any
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
          this.props.togglePkgImported()
        }
      }
    )
  }

  public render() {
    return (
      <div style={{ width: 'inherit', height: 'inherit' }}>
        <SideBar />
        <MenuBar appTitle="GoDepExplorer UI" />
        <InfoPanel />
        <Canvas />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    turnOffLoadingIndicator: () => dispatch(turnOffLoadingIndicator()),
    addNewGraph: (newGraph: GraphType.IListGraph) => {
      dispatch(addNewGraph(newGraph))
    },
    togglePkgImported: () => dispatch(togglePkgImported())
  }
}

export default connect(null, mapDispatchToProps)(Root)
