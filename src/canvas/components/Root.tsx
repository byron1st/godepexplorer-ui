import * as React from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'
import * as IPCType from '../../IPCTypes'
import { ListGraph } from '../../GlobalTypes'
import { graphActions, uiActions } from '../Actions'
import SideBar from './sideBar/SideBar'
import MenuBar from './menuBar/MenuBar'
import Canvas from './canvas/Canvas'
import InfoPanel from './infoPanel/InfoPanel'

const VisNetworkCompID = 'vis-canvas'

type RootProps = {
  updateGraph: (newGraph: ListGraph) => any
  turnOffLoadingIndicator: () => any
}

class Root extends React.Component<RootProps> {
  constructor (props: RootProps) {
    super(props)

    ipcRenderer.on(IPCType.GetDepOfPkg.Response, (event: any, newGraph: ListGraph) => {
      this.props.turnOffLoadingIndicator()
      this.props.updateGraph(newGraph)
    })
  }

  render () {
    return (
      <div style={{width: 'inherit', height: 'inherit'}}>
        <SideBar />
        <MenuBar appTitle='GoDepExplorer UI' />
        <InfoPanel />
        <Canvas compID={VisNetworkCompID}/>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch: any) {
  return {
    updateGraph: (newGraph: ListGraph) => {
      dispatch(graphActions.updateGraph(newGraph))
    },
    turnOffLoadingIndicator: () => dispatch(uiActions.turnOffLoadingIndicator())
  }
}

export default connect(null, mapDispatchToProps)(Root)
