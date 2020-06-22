import { TreeNode } from "ducks/tag"
import { Id } from "common"

const treeFilter = (
  node: TreeNode,
  func: (node: TreeNode) => boolean,
): TreeNode | undefined => {
  const filteredChildren = node.children.filter((child) =>
    treeFilter(child, func),
  )
  return func(node)
    ? node
    : filteredChildren.length > 0
    ? { ...node, children: filteredChildren }
    : undefined
}

const treeListFilter = (func: (node: TreeNode) => boolean) => (
  nodes: TreeNode[],
): TreeNode[] => {
  return nodes
    .map((node) => treeFilter(node, func))
    .filter((node): node is TreeNode => node !== undefined)
}

export const applyFilters = (
  nodes: TreeNode[],
  { byActivityTagId, byId, byName }: Filters,
) => {
  const applyFilter = (filter: ({ tag }: TreeNode) => boolean) => {
    nodes = treeListFilter(filter)(nodes)
  }
  byName && applyFilter(nameFilter(byName.trim()))
  byId && applyFilter(idFilter(byId))
  byActivityTagId && applyFilter(activityTagIdFilter(byActivityTagId))
  return nodes
}

export type Filters = {
  byName?: string
  byId?: Id
  byActivityTagId?: Id
}

const nameFilter = (name: string) => ({ tag }: TreeNode) =>
  tag.name.toLowerCase().includes(name)

const idFilter = (id: Id) => ({ tag }: TreeNode) => tag.id === id

const activityTagIdFilter = (id: Id) => ({ activity }: TreeNode) => {
  return activity!.tagIds.includes(id)
}
