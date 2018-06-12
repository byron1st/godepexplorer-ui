import { remote } from 'electron'
import * as React from 'react'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import fontawesome from '@fortawesome/fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/fontawesome-free-solid'
import * as StateType from '../../reducers/Type'
import * as actions from '../../actions'
import DataSet from '../../graph/DataSet'
import { PkgType } from '../../graph/Type'

interface ISideBarListItemProps {
  id: string
  index: number
  enclosingList: string[]
  isVisible: boolean
  isSelected: boolean
  selectedNodeList: string[]
  type: PkgType
  select: (selected: StateType.ISelectedState) => any
  deselect: (deselected: StateType.ISelectedState) => any
  showNode: (id: string, type: string) => any
  hideNode: (id: string, type: string) => any
  showInfo: (infoPanelData: StateType.ISelectedState) => any
}

const faEyeIcon = fontawesome.icon(faEye)
const faEyeSlashIcon = fontawesome.icon(faEyeSlash)

class SideBarListItem extends React.Component<ISideBarListItemProps> {
  constructor(props: ISideBarListItemProps) {
    super(props)

    this.openContextMenu = this.openContextMenu.bind(this)
    this.click = this.click.bind(this)
  }

  public componentDidMount() {
    this.addEyeIcon()
  }

  public componentDidUpdate() {
    this.addEyeIcon()
  }

  public render() {
    return (
      <div
        // @ts-ignore
        // "WebkitUserSelect"이 string 타입을 가질 수 없다고 ts-error를 발생시킴.
        // 하지만 가질 수 있음.
        onClick={this.click}
        onContextMenu={this.openContextMenu}
        style={
          this.props.isSelected ? style.selectedItem : style.unselectedItem
        }
      >
        <a href="#" style={style.text[this.props.type]}>
          <span id={`visible-icon-${this.props.id}`} />{' '}
          {DataSet.getNode(this.props.id).label}
        </a>
      </div>
    )
  }

  private click(e: any) {
    e.preventDefault()
    if (e.shiftKey) {
      const closestIndex = getClosestIndex(
        this.props.selectedNodeList,
        this.props.enclosingList,
        this.props.index
      )

      if (closestIndex !== -1) {
        const shiftSelectedNodeList = _.slice(
          this.props.enclosingList,
          closestIndex,
          this.props.index + 1
        )

        shiftSelectedNodeList.forEach(nodeID => this.select(nodeID))
      } else {
        this.select(this.props.id)
      }
    } else {
      this.select(this.props.id)
    }
  }

  private select(id: string) {
    const selected = DataSet.selectNode(id)

    this.props.isSelected
      ? this.props.deselect(selected)
      : this.props.select(selected)
  }

  private openContextMenu(e: any) {
    const menu = remote.Menu.buildFromTemplate(
      this.getMenuTemplate(
        this.props.id,
        this.props.showNode,
        this.props.hideNode,
        this.props.showInfo
      )
    )

    e.preventDefault()
    menu.popup({ window: remote.getCurrentWindow() })
  }

  private getMenuTemplate(
    id: string,
    showNode: (id: string, type: string) => any,
    hideNode: (id: string, type: string) => any,
    showInfo: (infoPanelData: StateType.ISelectedState) => any
  ) {
    const selectedNodeList = this.props.selectedNodeList
    return [
      {
        label: 'Show',
        click() {
          _.forEach(selectedNodeList, nodeID =>
            showNode(nodeID, DataSet.getNode(nodeID).type)
          )
        }
      },
      {
        label: 'Hide',
        click() {
          _.forEach(selectedNodeList, nodeID =>
            hideNode(nodeID, DataSet.getNode(nodeID).type)
          )
        }
      },
      {
        label: 'Show Info',
        click() {
          showInfo(DataSet.selectNode(id))
        }
      }
    ]
  }

  private addEyeIcon() {
    // @ts-ignore
    const iconSpan = document.getElementById(`visible-icon-${this.props.id}`)

    iconSpan.innerHTML = this.props.isVisible
      ? `${faEyeIcon.html[0]}`
      : `${faEyeSlashIcon.html[0]}`
  }
}

const style = {
  selectedItem: {
    paddingTop: 0,
    paddingBottom: 0,
    WebkitUserSelect: 'none',
    backgroundColor: '#FFC748'
  },
  unselectedItem: {
    paddingTop: 0,
    paddingBottom: 0,
    WebkitUserSelect: 'none'
  },
  text: {
    nor: {
      color: '#8BD8F1'
    },
    ext: {
      color: '#DFEBF7'
    },
    std: {
      color: '#789BAE'
    }
  }
}

function getClosestIndex(
  selectedNodeList: string[],
  enclosingList: string[],
  currentNodeIndex: number
) {
  for (let i = currentNodeIndex; i >= 0; i--) {
    if (selectedNodeList.indexOf(enclosingList[i]) !== -1) {
      return i
    }
  }

  return -1
}

function mapDispatchToProps(dispatch: any) {
  return {
    select: (selected: StateType.ISelectedState) => {
      dispatch(actions.select(selected))
    },
    deselect: (deselected: StateType.ISelectedState) => {
      dispatch(actions.deselect(deselected))
    },
    showNode: (id: string, type: string) => {
      dispatch(actions.showNode(id, type))
    },
    hideNode: (id: string, type: string) => {
      dispatch(actions.hideNode(id, type))
    },
    showInfo: (infoPanelData: StateType.ISelectedState) => {
      dispatch(actions.showInfo(infoPanelData))
    }
  }
}

export default connect(null, mapDispatchToProps)(SideBarListItem)
