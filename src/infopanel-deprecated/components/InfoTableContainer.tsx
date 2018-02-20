import * as React from 'react'
import Table from './GoDepTable'

interface InfoTableState {
  isVisible: boolean
}

interface InfoTableProps {
  data: any
  header: string
}

export default class InfoTableContainer extends React.Component<InfoTableProps, InfoTableState> {
  state = {
    isVisible: true
  }

  changeVisible () {
    this.setState({ isVisible: !this.state.isVisible })
  }

  render () {
    return <div style={style.container}>
      <h2 onClick={this.changeVisible.bind(this)}>{this.props.header}</h2>
      <hr />
      {
        this.state.isVisible
        ? <Table data={this.props.data} header={this.props.header} />
        : null
      }
    </div>
  }
}

const style = {
  container: {
    width: 'inherit'
  }
}