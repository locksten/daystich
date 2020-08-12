import { createEntityAdapter, EntityId, EntityState } from "@reduxjs/toolkit"

type Orderable = { id: EntityId }

export const updateOrderings = <T extends Orderable, K extends keyof T>(
  type: "add" | "remove",
  state: EntityState<T>,
  key: K,
  filter: (e: T) => boolean,
  ordering?: { [k in K]?: number },
  id?: EntityId,
) => {
  if (ordering === undefined) return
  const adapter = createEntityAdapter<T>()
  const entities = adapter.getSelectors().selectAll(state)

  const filteredEntities = entities.filter((e) => filter(e))

  const entitiesToShift = filteredEntities.filter(
    type === "add"
      ? (e) => ((e[key] as unknown) as number) >= ordering[key]
      : (e) => ((e[key] as unknown) as number) > ordering[key],
  )

  adapter.updateMany(
    state,
    entitiesToShift.map((entity) => ({
      id: entity.id,
      changes: ({
        [key]:
          ((entity[key] as unknown) as number) +
          (type === "add" && entity.id === id ? 0 : type === "add" ? 1 : -1),
      } as unknown) as T,
    })),
  )
}

export const newMoveOneOrderable = <T extends Orderable, K extends keyof T>(
  state: EntityState<T>,
  key: K,
  fromFilter: (e: T) => boolean,
  from: { [k in K]?: number } & Orderable,
  toFilter: (e: T) => boolean,
  to: { [k in K]?: number },
) => {
  updateOrderings("add", state, key, toFilter, to, from.id)
  updateOrderings("remove", state, key, fromFilter, from)
}
