import { Id } from "common"
import { Activity } from "ducks/activity"
import { Tag } from "ducks/tag"
import { EntityState, EntityAdapter } from "@reduxjs/toolkit"

export const defaultTagColor = "#4A5568"

export const rootActivityId = "rootActivityId-xiftrK"

export const isRootActivityId = (id?: Id) => id === "rootActivityId-xiftrK"

export const isRootActivity = ({ id }: { id?: Id }) =>
  id === "rootActivityId-xiftrK"

export const rootActivityTag: Tag = {
  id: rootActivityId,
  name: "Activity",
  color: "#4A5568",
  displayAtTopLevel: false,
}

export const rootActivity: Activity = {
  id: rootActivityId,
  tagIds: [],
}

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
