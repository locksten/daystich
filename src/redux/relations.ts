import { Id } from "common"
import { EntityState, EntityAdapter } from "@reduxjs/toolkit"

export const removeOneToManyRelation = <Entity extends { id: Id }>(
  state: EntityState<Entity>,
  adapter: EntityAdapter<Entity>,
  relationKey: keyof Entity,
  EntityIds: Id[],
  RelationIds: Id[],
  replacementId?: Id,
) => {
  const entities = adapter
    .getSelectors()
    .selectAll(state)
    .filter((entity) => EntityIds.includes(entity.id))
  adapter.updateMany(
    state,
    entities.map((entity) => ({
      id: entity.id,
      changes: ({
        [relationKey]: [
          ...((entity[relationKey] as unknown) as Id[]).filter(
            (relationId) =>
              !RelationIds.includes(relationId) && relationId !== replacementId,
          ),
          ...(replacementId ? [replacementId] : []),
        ],
      } as unknown) as Partial<Entity>,
    })),
  )
}
