import {
  createEntityAdapter,
  Dictionary,
  EntityId,
  EntityState,
} from "@reduxjs/toolkit"
import createCachedSelector from "re-reselect"
import { getChildren } from "redux/common/hierarchySelectors"
import { newMoveOneOrderable, updateOrderings } from "redux/common/orderable"
import { RootState } from "redux/redux/rootReducer"

// types ///////////////////////////////////////////////////////////////////////

export type NestedOrderable<T = EntityId> = {
  id: T
  parentId?: T
  /** Ordering in the context of a parent. Must be defined if parentId is defined. */
  ordering?: number
  /** Ordering in the context of the top level of the tree. */
  topLevelOrdering?: number
}

export type NestedOrderableNode<T extends NestedOrderable> = {
  entity: T
  /** Children of the entity, excluding top level ones. */
  children: NestedOrderableNode<T>[]
  /** Whether the entity has children, including top level ones. */
  hasChildren: boolean
}

// actions /////////////////////////////////////////////////////////////////////

/** Moving to and ordering of -1 moves the entity to the end of the list. */
export const moveNestedOrderable = <T extends NestedOrderable>(
  state: EntityState<T>,
  {
    id,
    to,
    replacementParentId,
    parentOverrides,
  }: {
    id: EntityId
    replacementParentId?: EntityId
    parentOverrides?: Partial<NestedOrderable>
    to: Pick<T, "parentId" | "ordering" | "topLevelOrdering">
  },
) => {
  const adapter = createEntityAdapter<T>()
  const entity = adapter.getSelectors().selectById(state, id)!
  if (replacementParentId !== undefined) {
    makeNestedOrderableChildOfItsClone(state, {
      id: to.parentId!,
      newParentId: replacementParentId,
      overrides: parentOverrides,
    })
    to.ordering = -1
    to.parentId = replacementParentId
  }

  const entities = adapter.getSelectors().selectAll(state)
  if (to.ordering === -1) {
    to.ordering = entities.filter((e) => e.parentId === to.parentId).length
  }
  if (to.topLevelOrdering === -1) {
    to.topLevelOrdering = entities.filter(
      (e) => e.topLevelOrdering !== undefined,
    ).length
  }

  adapter.updateOne(state, {
    id: entity.id,
    changes: to as Partial<T>,
  })
  updateOtherOrderings(state, entity, to)
}

export const detachTopLevelNestedOrderableFromParent = <
  T extends NestedOrderable
>(
  state: EntityState<T>,
  id: EntityId,
) => {
  const adapter = createEntityAdapter<T>()
  const entity = adapter.getSelectors().selectById(state, id)!
  adapter.updateOne(state, {
    id: entity.id,
    changes: {
      parentId: undefined,
      ordering: undefined,
    },
  })
  updateOtherOrderings(state, entity, {
    parentId: undefined,
    ordering: undefined,
  })
}

export const returnTopLevelNestedOrderableToParent = <
  T extends NestedOrderable
>(
  state: EntityState<T>,
  id: EntityId,
) => {
  const adapter = createEntityAdapter<T>()
  const entity = adapter.getSelectors().selectById(state, id)!
  adapter.updateOne(state, {
    id: entity.id,
    changes: {
      topLevelOrdering: undefined,
    },
  })
  updateOtherOrderings(state, entity, {
    topLevelOrdering: undefined,
  })
}

export const removeNestedOrderable = <T extends NestedOrderable>(
  state: EntityState<T>,
  id: EntityId,
  otherAffectedIds: EntityId[],
) => {
  const adapter = createEntityAdapter<T>()
  const allIds = [...otherAffectedIds, id]
  allIds.forEach((id) => {
    const entity = adapter.getSelectors().selectById(state, id)!
    updateOrderings(
      "remove",
      state,
      "ordering",
      (t) => t.parentId === entity.parentId,
      entity,
    )
    updateOrderings(
      "remove",
      state,
      "topLevelOrdering",
      (t) => t.topLevelOrdering !== undefined,
      entity,
    )
  })
  adapter.removeMany(state, allIds)
}

// helpers /////////////////////////////////////////////////////////////////////

const updateOtherOrderings = <T extends NestedOrderable>(
  state: EntityState<T>,
  original: T,
  to: Pick<T, "parentId" | "ordering" | "topLevelOrdering">,
) => {
  if ("ordering" in to) {
    newMoveOneOrderable(
      state,
      "ordering",
      (t) => t.parentId === original.parentId,
      original,
      (t) => t.parentId === to.parentId,
      to,
    )
  }

  if ("topLevelOrdering" in to) {
    newMoveOneOrderable(
      state,
      "topLevelOrdering",
      (t) => t.topLevelOrdering !== undefined,
      original,
      (t) => t.topLevelOrdering !== undefined,
      to,
    )
  }
}

/** Creates a clone of the entity,
 * makes it a child of the clone,
 * and spreads overrides over it.
 * @param id the id of the entity to turn into a child
 * @param newParentId the id for the clone
 * @param overrides the object to spread over the entity
 */
const makeNestedOrderableChildOfItsClone = <T extends NestedOrderable>(
  state: EntityState<T>,
  {
    id,
    newParentId,
    overrides,
  }: {
    id: EntityId
    newParentId: EntityId
    overrides?: Partial<T>
  },
) => {
  const adapter = createEntityAdapter<T>()
  const entity = adapter.getSelectors().selectById(state, id!)!
  adapter.addOne(state, {
    ...entity,
    id: newParentId,
  })
  adapter.updateOne(state, {
    id: entity.id,
    changes: {
      ordering: undefined,
      topLevelOrdering: undefined,
      ...overrides,
    } as Partial<T>,
  })
  moveNestedOrderable(state, {
    id: entity.id,
    to: { parentId: newParentId, ordering: 0 },
  })
}

// selectors ///////////////////////////////////////////////////////////////////

/** Makes a selector for a list of trees where entities that are at the top level
 * and entities with top level ordering defined are only at the top level.
 */
export const makeNestedOrderableTreeListSelector = <T extends NestedOrderable>(
  arraySelector: (state: RootState) => T[],
  dictionarySelector: (state: RootState) => Dictionary<T>,
) =>
  createCachedSelector(
    arraySelector,
    dictionarySelector,
    (_: RootState, id?: EntityId) => id,
    (entities, entityDict, id): NestedOrderableNode<T>[] => {
      const getNode = (id: EntityId): NestedOrderableNode<T> => {
        const allChildren = getChildren(entities, id).sort(
          (a, b) => a.ordering! - b.ordering!,
        )
        const nonTopLevelChildren = allChildren
          .filter((entity) => entity.topLevelOrdering === undefined)
          .map(({ id }) => getNode(id))
        return {
          entity: entityDict[id] as T,
          children: nonTopLevelChildren,
          hasChildren: allChildren.length !== 0,
        }
      }

      return id !== undefined
        ? [getNode(id)]
        : entities
            .filter((entity) => entity.topLevelOrdering !== undefined)
            .sort((a, b) => a.topLevelOrdering! - b.topLevelOrdering!)
            .map(({ id }) => getNode(id))
    },
  )((_, __, id) => id || "")

export const makeTopLevelEntityIdsSelector = <T extends NestedOrderable>(
  arraySelector: (state: RootState) => T[],
) =>
  createCachedSelector(
    arraySelector,
    (entities) =>
      entities
        .filter((entity) => entity.topLevelOrdering !== undefined)
        .map(({ id }) => id) as T["id"][],
  )((_, __, id) => id || "")
