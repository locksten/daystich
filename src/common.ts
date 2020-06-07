import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "ducks/redux/rootReducer"
import createCachedSelector from "re-reselect"

export type Timestamp = number

export type Duration = number

export type Id = string

export type Table<T> = {
  byId: {
    [id: string]: T & { id: Id }
  }
  allIds: string[]
}

export const getTableSelectors = <T>(
  selectTable: (state: RootState) => Table<T>,
) => {
  const allIds = (state: RootState) => selectTable(state).allIds
  const byIds = (state: RootState) => selectTable(state).byId
  const length = createSelector([allIds], (allIds) => allIds.length)
  const byId = createCachedSelector(
    [byIds, (_: RootState, id: Id | undefined) => id],
    (byIds, id) => (id === undefined ? undefined : byIds[id]),
  )((_byIds, id) => id || "undefined")
  const all = createSelector([allIds, byIds], (allIds, byIds) =>
    allIds.map((id) => byIds[id]),
  )
  const filter = <A>(fn: (entry: T, arg: A) => boolean) => {
    return createCachedSelector(
      [all, (_: RootState, arg: A) => arg],
      (all, arg) => all.filter((entry) => fn(entry, arg)),
    )((_all, arg) => arg)
  }

  return {
    selectors: {
      allIds,
      byIds,
      length,
      byId,
      all,
    },
    selectorFactories: {
      filter,
    },
  }
}

export const neg1ToUndefined = (n: number) => (n === -1 ? undefined : n)

export const mapUndef = <T, R>(
  arg: T | undefined,
  func: (_: T) => R,
): R | undefined => (arg === undefined ? undefined : func(arg))

export const isNumeric = (n: string) => !isNaN(Number(n))
