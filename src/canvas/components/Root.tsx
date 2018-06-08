import { ipcRenderer } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import { Graph } from 'godeptypes'
import * as IPCType from '../../IPCTypes'
import { dataActions } from '../Actions_deprecated'
import { turnOffLoadingIndicator, togglePkgImported } from '../actions'
import Canvas from './canvas/Canvas'
import InfoPanel from './infoPanel/InfoPanel'
import MenuBar from './menuBar/MenuBar'
import SideBar from './sideBar/SideBar'

interface IRootProps {
  turnOffLoadingIndicator: () => any
  initSideBarData: (initSideBarState: Graph.IListGraph) => any
  togglePkgImported: () => any
}

class Root extends React.Component<IRootProps> {
  constructor(props: IRootProps) {
    super(props)

    ipcRenderer.on(
      IPCType.GetDepOfPkg.Response,
      (event: any, newGraph: Graph.IListGraph) => {
        this.props.turnOffLoadingIndicator()

        if (newGraph) {
          this.props.initSideBarData(newGraph)
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
    initSideBarData: (initSideBarState: Graph.IListGraph) => {
      dispatch(dataActions.initSideBarData(initSideBarState))
    },
    togglePkgImported: () => dispatch(togglePkgImported())
  }
}

export default connect(null, mapDispatchToProps)(Root)
