import { remote } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import { graphActions, uiActions } from '../../Actions'
import * as IPC from '../../ipc'
import { IRootState } from '../../Reducers'

interface IMenuListProps {
  loadingPath: string
  isLoading: boolean
  resetGraph: () => any
  turnOnLoadingIndicator: (packagePath: string) => any
}

class MenuList extends React.Component<IMenuListProps> {
  constructor(props: IMenuListProps) {
    super(props)

    this.openSelectDirectoryDialog = this.openSelectDirectoryDialog.bind(this)
  }

  public render() {
    return [
      <div
        className="collapse navbar-collapse"
        id="mainMenu"
        key="menu-list-key"
      >
        <div className="navbar-nav">
          <a
            className="nav-item nav-link"
            onClick={this.openSelectDirectoryDialog}
          >
            Load
          </a>
          <a className="nav-item nav-link" onClick={this.props.resetGraph}>
            Reset
          </a>
        </div>
      </div>,
      <span className="navbar-text" key="loading-indicator-key">
        {this.props.isLoading ? (
          <span>
            <i className="fas fa-spinner fa-pulse" /> {this.props.loadingPath}
          </span>
        ) : null}
      </span>
    ]
  }

  private openSelectDirectoryDialog() {
    remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      (filepaths: string[]) => {
        if (filepaths) {
          const packagePath = extractRootPath(filepaths[0])
          if (packagePath) {
            this.props.turnOnLoadingIndicator(packagePath)
            IPC.sendDepReq(packagePath, true, {})
          }
        }
      }
    )
  }
}

function extractRootPath(filePath: string) {
  const gopath = process.env.GOPATH

  if (gopath) {
    if (filePath.startsWith(`${gopath}/src`)) {
      return filePath.slice(`${gopath}/src`.length + 1)
    } else {
      remote.dialog.showErrorBox(
        'Error',
        'Directory should be inside $GOPATH/src'
      )
    }
  } else {
    remote.dialog.showErrorBox('Error', 'GOPAHT is not set.')
  }
}

function mapStateToProps(state: IRootState) {
  return {
    isLoading: state.uiState.isLoading,
    loadingPath: state.uiState.loadingPath
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    resetGraph: () => dispatch(graphActions.resetGraph()),
    turnOnLoadingIndicator: (packagePath: string) => {
      dispatch(uiActions.turnOnLoadingIndicator(packagePath))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuList)
