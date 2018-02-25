import * as React from 'react'
import { connect } from 'react-redux'
import { uiActions } from '../../Actions'
import { IRootState } from '../../Reducers'
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

function mapStateToProps(state: IRootState) {
  return {
    isExtVisible: state.uiState.isExtVisible,
    isStdVisible: state.uiState.isStdVisible
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    changeExtVisible: () => dispatch(uiActions.changeExtVisible()),
    changeStdVisible: () => dispatch(uiActions.changeStdVisible())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewConfig)
