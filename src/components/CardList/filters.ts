import { TreeNode } from "redux/ducks/tag"
import { Id } from "common"

export type Filters = {
  byName?: string
  byId?: Id
  byNotId?: Id
  byActivityTagId?: Id
}

type Predicate = (node: TreeNode) => boolean

const nameFilter = (name: string) => ({ tag }: TreeNode) =>
  tag.name.toLowerCase().includes(name)

const idFilter = (id: Id) => ({ tag }: TreeNode) => tag.id === id

const activityTagIdFilter = (id: Id) => ({ activity }: TreeNode) => {
  return activity!.tagIds.includes(id)
}

const inverted = (pred: Predicate) => (...args: Parameters<typeof pred>) =>
  !pred(...args)

const treeFilter = (
  node: TreeNode,
  pred: Predicate,
  strict: boolean,
): TreeNode | undefined => {
  const filteredChildren = treeListFilter(pred, strict)(node.children)
  return strict
    ? pred(node)
      ? { ...node, children: filteredChildren }
      : undefined
    : pred(node)
    ? node
    : filteredChildren.length > 0
    ? { ...node, children: filteredChildren }
    : undefined
}

const treeListFilter = (pred: Predicate, strict: boolean) => (
  nodes: TreeNode[],
): TreeNode[] => {
  return nodes
    .map((node) => treeFilter(node, pred, strict))
    .filter((node): node is TreeNode => node !== undefined)
}

export const applyFilters = (
  nodes: TreeNode[],
  { byActivityTagId, byId, byNotId, byName }: Filters,
) => {
  const applyFilter = (pred: Predicate, strict: boolean = false) => {
    nodes = treeListFilter(pred, strict)(nodes)
  }
  byName && applyFilter(nameFilter(byName.trim()))
  byId && applyFilter(idFilter(byId))
  byNotId && applyFilter(inverted(idFilter(byNotId)), true)
  byActivityTagId && applyFilter(activityTagIdFilter(byActivityTagId))
  return nodes
}
