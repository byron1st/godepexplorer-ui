import * as React from 'react'
import { connect } from 'react-redux'
import * as StateType from '../../reducers/Type'
import { toggleIgnoreStd } from '../../actions'
import UnaryViewConfig from './UnaryViewConfig'

interface IViewConfigProps {
  ignoreStd: boolean
  toggleIgnoreStd: () => any
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

function mapStateToProps(state: StateType.IRootState) {
  return {
    ignoreStd: state.data.sideBarData.ignoreStd
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    toggleIgnoreStd: () => dispatch(toggleIgnoreStd())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewConfig)
