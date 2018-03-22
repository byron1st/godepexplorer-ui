import * as React from 'react'
import { connect } from 'react-redux'
import { State } from 'godeptypes'
import { uiActions, dataActions } from '../../Actions'
import UnaryViewConfig from './UnaryViewConfig'

interface IViewConfigProps {
  ignoreStd: boolean
  // isStdVisible: boolean
  // isExtVisible: boolean
  toggleIgnoreStd: () => any
  // changeStdVisible: () => any
  // changeExtVisible: () => any
}

class ViewConfig extends React.Component<IViewConfigProps> {
  public render() {
    return (
      <div>
        <UnaryViewConfig
          header="Standard Library"
          current={this.props.ignoreStd}
          toggle={this.props.toggleIgnoreStd}
        />
      </div>
    )
  }
}

function mapStateToProps(state: State.IRootState) {
  return {
    // isExtVisible: state.ui.isExtVisible,
    // isStdVisible: state.ui.isStdVisible
    ignoreStd: state.data.sideBarData.ignoreStd
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    // changeExtVisible: () => dispatch(uiActions.changeExtVisible()),
    // changeStdVisible: () => dispatch(uiActions.changeStdVisible())
    toggleIgnoreStd: () => dispatch(dataActions.toggleIgnoreStd())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewConfig)
