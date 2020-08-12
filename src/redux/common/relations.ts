import { createEntityAdapter, EntityId, EntityState } from "@reduxjs/toolkit"

/**
 * @param entityIds the ids of the entities to remove the relation ids from
 * @param relationKey the property of the entities that contains the relation ids
 * @param relationIds the ids to remove from the relation
 * @param replacementId the id to optionally replace the removed ids with
 */
export const removeOneToManyRelation = <Entity extends { id: EntityId }>(
  state: EntityState<Entity>,
  entityIds: EntityId[],
  relationKey: keyof Entity,
  relationIds: EntityId[],
  replacementId?: EntityId,
) => {
  const adapter = createEntityAdapter<Entity>()
  const entities = adapter
    .getSelectors()
    .selectAll(state)
    .filter((entity) => entityIds.includes(entity.id))
  adapter.updateMany(
    state,
    entities.map((entity) => ({
      id: entity.id,
      changes: ({
        [relationKey]: [
          ...((entity[relationKey] as unknown) as EntityId[]).filter(
            (relationId) =>
              !relationIds.includes(relationId) && relationId !== replacementId,
          ),
          ...(replacementId ? [replacementId] : []),
        ],
      } as unknown) as Partial<Entity>,
    })),
  )
}
