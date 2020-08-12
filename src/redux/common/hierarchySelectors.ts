import { Dictionary, EntityId, EntitySelectors } from "@reduxjs/toolkit"
import createCachedSelector from "re-reselect"
import { RootState } from "redux/redux/rootReducer"

export type HierarchyEntity = { id: EntityId; parentId?: EntityId }

/** Makes a selector for the value of the specified property
 * of the nearest ancestor that has the property defined.
 */
export const makeInheritedPropertySelector = <T extends HierarchyEntity>(
  dictionarySelector: (state: RootState) => Dictionary<T>,
) => <R>(key: keyof T, defaultValue: R) =>
  createCachedSelector(
    dictionarySelector,
    (_: RootState, id: EntityId) => id,
    (entities, id): R => {
      const findProperty = (entityId: EntityId): R => {
        const entity = entities[entityId]!
        const parentId = entities[entityId]?.parentId
        const parent = parentId ? entities[parentId] : undefined
        return entity[key]
          ? ((entity[key] as unknown) as R)
          : parent
          ? findProperty(parent.id)
          : defaultValue
      }
      return findProperty(id)
    },
  )((_: RootState, id) => id)

export const getChildren = <T extends HierarchyEntity>(
  entities: T[],
  id: EntityId,
) => entities.filter((entity) => entity?.parentId === id)

export const makeChildrenSelector = <
  T extends { id: EntityId; parentId?: EntityId }
>(
  arraySelector: (state: RootState) => T[],
) =>
  createCachedSelector(
    arraySelector,
    (_: RootState, id: EntityId) => id,
    getChildren,
  )((_: RootState, id) => id)

export const getDescendants = <T extends HierarchyEntity>(
  entities: T[],
  id: EntityId,
) => {
  const descendants: T[] = []
  const addChildren = (id: EntityId) => {
    const children = getChildren(entities, id)
    descendants.push(...children)
    children.map(({ id }) => addChildren(id))
  }
  addChildren(id)
  return descendants
}

export const makeDescendantIdsSelector = <
  T extends { id: EntityId; parentId?: EntityId }
>(
  arraySelector: (state: RootState) => T[],
) =>
  createCachedSelector(
    arraySelector,
    (_: RootState, id: EntityId) => id,
    (entities, id): T["id"][] =>
      getDescendants(entities, id).map(({ id }) => id),
  )((_: RootState, id) => id)

export const makeHierarchySelectors = <T extends HierarchyEntity>({
  selectAll,
  selectEntities,
}: EntitySelectors<T, RootState>) => {
  return {
    selectInheritedProperty: makeInheritedPropertySelector(selectEntities),
    selectChildren: makeChildrenSelector(selectAll),
    selectDescendantIds: makeDescendantIdsSelector(selectAll),
  }
}
