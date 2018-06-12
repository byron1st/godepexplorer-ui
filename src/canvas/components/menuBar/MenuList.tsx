import { ipcRenderer, remote } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import fontawesome from '@fortawesome/fontawesome'
import { faSpinner } from '@fortawesome/fontawesome-free-solid'
import * as StateType from '../../reducers/Type'
import { turnOnLoadingIndicator } from '../../actions'
import { IPCGetDep } from '../../../IPCType'

interface IMenuListProps {
  loadingPath: string
  isLoading: boolean
  pkgImported: boolean
  turnOnLoadingIndicator: (packagePath: string) => any
}

const faSpinnerIcon = fontawesome.icon(faSpinner, { classes: ['fa-pulse'] })

class MenuList extends React.Component<IMenuListProps> {
  constructor(props: IMenuListProps) {
    super(props)

    this.openSelectDirectoryDialog = this.openSelectDirectoryDialog.bind(this)
  }

  public componentDidUpdate() {
    // @ts-ignore
    const indicatorSpan = document.getElementById('loading-indicator')

    indicatorSpan.innerHTML = this.props.isLoading
      ? `${faSpinnerIcon.html[0]} ${this.props.loadingPath}`
      : ''
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
            Import
          </a>
          {this.props.pkgImported ? (
            <a
              className="nav-item nav-link"
              onClick={this.openResetWarningDialog}
            >
              Reset
            </a>
          ) : null}
        </div>
      </div>,
      <span
        className="navbar-text"
        key="loading-indicator-key"
        id="loading-indicator"
      />
    ]
  }

  private openResetWarningDialog() {
    remote.dialog.showMessageBox(
      {
        type: 'warning',
        buttons: ['Ok', 'Cancel'],
        message: 'This will reset the current diagram. Do you want to proceed?'
      },
      (response: number) => {
        if (response === 0) {
          remote.getCurrentWebContents().reload()
        }
      }
    )
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
            // IPC.sendDepReq(packagePath)
            ipcRenderer.send(IPCGetDep.Request, packagePath)
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

function mapStateToProps(state: StateType.IRootState) {
  return {
    isLoading: state.ui.isLoading,
    loadingPath: state.ui.loadingPath,
    pkgImported: state.ui.pkgImported
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    turnOnLoadingIndicator: (packagePath: string) => {
      dispatch(turnOnLoadingIndicator(packagePath))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuList)
