import { remote } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import { State } from 'godeptypes'
import { uiActions } from '../../Actions'
import * as IPC from '../../ipc'

interface IMenuListProps {
  loadingPath: string
  isLoading: boolean
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
            New
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
    remote.dialog.showMessageBox(
      {
        type: 'warning',
        buttons: ['Ok', 'Cancel'],
        message: 'This will reset the current diagram. Do you want to proceed?'
      },
      (response: number) => {
        if (response === 0) {
          remote.dialog.showOpenDialog(
            {
              properties: ['openDirectory']
            },
            (filepaths: string[]) => {
              if (filepaths) {
                const packagePath = extractRootPath(filepaths[0])
                if (packagePath) {
                  this.props.turnOnLoadingIndicator(packagePath)
                  IPC.sendDepReq(packagePath)
                }
              }
            }
          )
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

function mapStateToProps(state: State.IRootState) {
  return {
    isLoading: state.ui.isLoading,
    loadingPath: state.ui.loadingPath
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    turnOnLoadingIndicator: (packagePath: string) => {
      dispatch(uiActions.turnOnLoadingIndicator(packagePath))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuList)
