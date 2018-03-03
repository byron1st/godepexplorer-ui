import { ipcRenderer } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import { Graph, State } from 'godeptypes'
import * as IPCType from '../../IPCTypes'
import { uiActions, dataActions } from '../Actions'
import DataSet from '../DataSet'
import Canvas from './canvas/Canvas'
import InfoPanel from './infoPanel/InfoPanel'
import MenuBar from './menuBar/MenuBar'
import SideBar from './sideBar/SideBar'

interface IRootProps {
  turnOffLoadingIndicator: () => any
  initSideBarData: (initSideBarState: State.ISideBarState) => any
}

class Root extends React.Component<IRootProps> {
  constructor(props: IRootProps) {
    super(props)

    ipcRenderer.on(
      IPCType.GetDepOfPkg.Response,
      (event: any, newGraph: Graph.IListGraph) => {
        this.props.turnOffLoadingIndicator()

        if (newGraph) {
          this.props.initSideBarData(DataSet.init(newGraph))
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
    turnOffLoadingIndicator: () =>
      dispatch(uiActions.turnOffLoadingIndicator()),
    initSideBarData: (initSideBarState: State.ISideBarState) => {
      dispatch(dataActions.initSideBarData(initSideBarState))
    }
  }
}

export default connect(null, mapDispatchToProps)(Root)
