import { Node } from '../GlobalTypes'

export function filterNodeVisibility(
  node: Node,
  isStdVisible: boolean,
  isExtVisible: boolean
): boolean {
  if (node.isVisible) {
    let stdVisibility = isStdVisible && node.meta.isStd
    let extVisibility = isExtVisible && node.meta.isExternal

    return (
      (!node.meta.isStd && !node.meta.isExternal) ||
      stdVisibility ||
      extVisibility
    )
  } else {
    return false
  }
}
