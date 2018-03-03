import * as React from 'react'
import { connect } from 'react-redux'
import { State } from 'godeptypes'
import { uiActions } from '../../Actions'
import UnaryViewConfig from './UnaryViewConfig'

interface IViewConfigProps {
  isStdVisible: boolean
  isExtVisible: boolean
  changeStdVisible: () => any
  changeExtVisible: () => any
}

class ViewConfig extends React.Component<IViewConfigProps> {
  public render() {
    return (
      <div>
        <UnaryViewConfig
          header="Standard Library"
          trueLabel="View"
          falseLabel="Hide"
          current={this.props.isStdVisible}
          handleChange={this.props.changeStdVisible}
        />
        <UnaryViewConfig
          header="External Library"
          trueLabel="View"
          falseLabel="Hide"
          current={this.props.isExtVisible}
          handleChange={this.props.changeExtVisible}
        />
      </div>
    )
  }
}

function mapStateToProps(state: State.IRootState) {
  return {
    isExtVisible: state.ui.isExtVisible,
    isStdVisible: state.ui.isStdVisible
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    changeExtVisible: () => dispatch(uiActions.changeExtVisible()),
    changeStdVisible: () => dispatch(uiActions.changeStdVisible())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewConfig)
