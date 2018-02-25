import { INode } from '../GlobalTypes'

export function filterNodeVisibility(
  node: INode,
  isStdVisible: boolean,
  isExtVisible: boolean
): boolean {
  if (node.isVisible) {
    const stdVisibility = isStdVisible && node.meta.isStd
    const extVisibility = isExtVisible && node.meta.isExternal

    return (
      (!node.meta.isStd && !node.meta.isExternal) ||
      stdVisibility ||
      extVisibility
    )
  } else {
    return false
  }
}
