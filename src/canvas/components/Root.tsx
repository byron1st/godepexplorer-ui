import { ipcRenderer } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import { IListGraph } from '../../GlobalTypes'
import * as IPCType from '../../IPCTypes'
import { graphActions, uiActions } from '../Actions'
import Canvas from './canvas/Canvas'
import InfoPanel from './infoPanel/InfoPanel'
import MenuBar from './menuBar/MenuBar'
import SideBar from './sideBar/SideBar'

const VisNetworkCompID = 'vis-canvas'

interface IRootProps {
  updateGraph: (newGraph: IListGraph) => any
  turnOffLoadingIndicator: () => any
}

class Root extends React.Component<IRootProps> {
  constructor(props: IRootProps) {
    super(props)

    ipcRenderer.on(
      IPCType.GetDepOfPkg.Response,
      (event: any, newGraph: IListGraph) => {
        this.props.turnOffLoadingIndicator()
        this.props.updateGraph(newGraph)
      }
    )
  }

  public render() {
    return (
      <div style={{ width: 'inherit', height: 'inherit' }}>
        <SideBar />
        <MenuBar appTitle="GoDepExplorer UI" />
        <InfoPanel />
        <Canvas compID={VisNetworkCompID} />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    turnOffLoadingIndicator: () =>
      dispatch(uiActions.turnOffLoadingIndicator()),
    updateGraph: (newGraph: IListGraph) => {
      dispatch(graphActions.updateGraph(newGraph))
    }
  }
}

export default connect(null, mapDispatchToProps)(Root)
