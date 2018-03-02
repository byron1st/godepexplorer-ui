import { ipcRenderer } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import { IListGraph } from '../../GlobalTypes'
import * as IPCType from '../../IPCTypes'
import { graphActions, uiActions } from '../Actions'
import Project from '../ldbc/Project'
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
  private project: Project

  constructor(props: IRootProps) {
    super(props)

    ipcRenderer.on(
      IPCType.GetDepOfPkg.Response,
      (event: any, newGraph: IListGraph) => {
        this.props.turnOffLoadingIndicator()

        if (newGraph) {
          // this.props.updateGraph(newGraph)
          // TODO:
          // 1. insert DB
          // 2.1 filtering normal (every visible), ext, std (every invisible)
          // 2.2 call data action
        }
      }
    )

    this.project = new Project('test-db')
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
