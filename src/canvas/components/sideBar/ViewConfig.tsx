import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../Reducers'
import { uiActions } from '../../Actions'
import UnaryViewConfig from './UnaryViewConfig'

type ViewConfigProps = {
  isStdVisible: boolean
  isExtVisible: boolean
  changeStdVisible: () => any
  changeExtVisible: () => any
}

class ViewConfig extends React.Component<ViewConfigProps> {
  render() {
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

function mapStateToProps(state: RootState) {
  return {
    isStdVisible: state.uiState.isStdVisible,
    isExtVisible: state.uiState.isExtVisible
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    changeStdVisible: () => dispatch(uiActions.changeStdVisible()),
    changeExtVisible: () => dispatch(uiActions.changeExtVisible())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewConfig)
