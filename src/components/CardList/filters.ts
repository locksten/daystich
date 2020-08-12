import { ActivityId, Activity, isActivity } from "redux/ducks/activity/types"
import {
  NestedOrderableNode,
  NestedOrderable,
} from "redux/common/nestedOrderable"
import { EntityId } from "@reduxjs/toolkit"
import { TagId, Tag } from "redux/ducks/tag/types"

export type Filters = {
  byName?: string
  byId?: ActivityId | TagId
  byNotId?: ActivityId | TagId
  byActivityTagId?: TagId
}

type Predicate<T extends NestedOrderable> = (
  node: NestedOrderableNode<T>,
) => boolean

const nameFilter = <T extends NestedOrderable & { name: string }>(
  name: string,
) => ({ entity }: NestedOrderableNode<T>) =>
  entity.name.toLowerCase().includes(name)

const idFilter = <T extends NestedOrderable>(id: EntityId) => ({
  entity,
}: NestedOrderableNode<T>) => entity.id === id

const activityTagIdFilter = <T extends Activity | Tag>(id: TagId) => ({
  entity,
}: NestedOrderableNode<T>) => {
  return isActivity(entity) && !!entity.tagIds && entity.tagIds.includes(id)
}

const inverted = <T extends NestedOrderable>(pred: Predicate<T>) => (
  ...args: Parameters<typeof pred>
) => !pred(...args)

const treeFilter = <T extends NestedOrderable>(
  node: NestedOrderableNode<T>,
  pred: Predicate<T>,
  strict: boolean,
): NestedOrderableNode<T> | undefined => {
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

const treeListFilter = <T extends NestedOrderable>(
  pred: Predicate<T>,
  strict: boolean,
) => (nodes: NestedOrderableNode<T>[]): NestedOrderableNode<T>[] => {
  return nodes
    .map((node) => treeFilter<T>(node, pred, strict))
    .filter((node): node is NestedOrderableNode<T> => node !== undefined)
}

export const applyFilters = <T extends Activity | Tag>(
  nodes: NestedOrderableNode<T>[],
  { byActivityTagId, byId, byNotId, byName }: Filters,
) => {
  const applyFilter = (pred: Predicate<T>, strict: boolean = false) => {
    nodes = treeListFilter(pred, strict)(nodes)
  }
  byName && applyFilter(nameFilter(byName.trim()))
  byId && applyFilter(idFilter(byId))
  byNotId && applyFilter(inverted(idFilter(byNotId)), true)
  byActivityTagId && applyFilter(activityTagIdFilter(byActivityTagId))
  return nodes
}
