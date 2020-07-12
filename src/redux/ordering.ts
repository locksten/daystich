import { EntityAdapter, EntityState } from "@reduxjs/toolkit"
import { Id } from "common"

type Orderable = { id: Id; ordering: number }

export const upsertOneOrderable = <T extends Orderable>(
  state: EntityState<T>,
  adapter: EntityAdapter<T>,
  entity: Pick<T, "id">,
  position?: number,
  filter?: (e: T) => boolean,
) => {
  const entities = adapter.getSelectors().selectAll(state)
  const filteredEntities = filter ? entities.filter(filter) : entities
  if (position !== undefined) {
    const entitiesToShift = filteredEntities.filter(
      (e) => e.ordering >= position,
    )
    adapter.updateMany(
      state,
      entitiesToShift.map(({ id, ordering }) => ({
        id,
        changes: {
          ordering: ordering + 1,
        } as T,
      })),
    )
  }
  adapter.upsertOne(state, {
    ...entity,
    ordering: position ?? filteredEntities.length,
  } as T)
}

export const removeOneOrderable = <T extends Orderable>(
  state: EntityState<T>,
  adapter: EntityAdapter<T>,
  id: Id,
  filter?: (e: T) => boolean,
) => {
  const entity = adapter.getSelectors().selectById(state, id)

  if (entity !== undefined) {
    const entities = adapter.getSelectors().selectAll(state)
    const filteredEntities = filter ? entities.filter(filter) : entities
    const entitiesToShift = filteredEntities.filter(
      (e) => e.ordering > entity.ordering,
    )
    adapter.updateMany(
      state,
      entitiesToShift.map(({ id, ordering }) => ({
        id,
        changes: {
          ordering: ordering - 1,
        } as T,
      })),
    )
    adapter.removeOne(state, id)
  }
}

export const removeManyOrderables = <T extends Orderable>(
  state: EntityState<T>,
  adapter: EntityAdapter<T>,
  ids: Id[],
  filter?: (e: T) => boolean,
) => ids.map((id) => removeOneOrderable(state, adapter, id, filter))

export const moveOneOrderable = <T extends Orderable>(
  state: EntityState<T>,
  adapter: EntityAdapter<T>,
  entity: Pick<T, "id">,
  newPosition?: number,
  filterFrom?: (e: T) => boolean,
  filterTo?: (e: T) => boolean,
) => {
  removeOneOrderable(state, adapter, entity.id, filterFrom)
  upsertOneOrderable(state, adapter, entity, newPosition, filterTo)
}
