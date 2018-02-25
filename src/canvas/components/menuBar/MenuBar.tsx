import * as React from 'react'
import MenuList from './MenuList'

interface IMenuBarProps {
  appTitle: string
}

export default (props: IMenuBarProps) => (
  <nav className="navbar fixed-top navbar-expand-sm navbar-dark bg-dark">
    <div className="navbar-brand">{props.appTitle}</div>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#mainMenu"
      aria-controls="navbarNavAltMarkup"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <MenuList />
  </nav>
)
