import * as React from 'react'
import { connect } from 'react-redux'
import * as StateType from '../../reducers/Type'
import VisNetwork from '../../graph/VisNetwork'

interface ICanvasProps {
  selected: StateType.ISelectedState
}

const VisNetworkCompID = 'vis-canvas'

class Canvas extends React.Component<ICanvasProps> {
  public componentDidMount() {
    // @ts-ignore document works well.
    VisNetwork.init(document.getElementById(VisNetworkCompID))
  }

  public componentWillUpdate(nextProps: ICanvasProps) {
    VisNetwork.setSelection(nextProps.selected)
  }

  public render() {
    return (
      <div style={style.container}>
        <div id={VisNetworkCompID} style={style.canvas} key="canvas-vis" />,
      </div>
    )
  }
}

const style = {
  canvas: {
    height: 'inherit',
    width: 'inherit'
  },
  container: {
    height: 'inherit',
    marginTop: '-150px',
    width: 'inherit'
  }
}

function mapStateToProps(state: StateType.IRootState) {
  return {
    selected: state.data.selected
  }
}

export default connect(mapStateToProps)(Canvas)
