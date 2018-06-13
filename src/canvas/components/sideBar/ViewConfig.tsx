import * as React from 'react'
import { connect } from 'react-redux'
import * as StateType from '../../reducers/Type'
import { toggleIgnoreStd, toggleIgnoreExt } from '../../actions'
import UnaryViewConfig from './UnaryViewConfig'

interface IViewConfigProps {
  ignoreStd: boolean
  ignoreExt: boolean
  toggleIgnoreStd: () => any
  toggleIgnoreExt: () => any
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
        <UnaryViewConfig
          header="External Library"
          current={this.props.ignoreExt}
          toggle={this.props.toggleIgnoreExt}
        />
      </div>
    )
  }
}

function mapStateToProps(state: StateType.IRootState) {
  return {
    ignoreStd: state.data.graphData.ignoreStd,
    ignoreExt: state.data.graphData.ignoreExt
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    toggleIgnoreStd: () => dispatch(toggleIgnoreStd()),
    toggleIgnoreExt: () => dispatch(toggleIgnoreExt())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewConfig)
