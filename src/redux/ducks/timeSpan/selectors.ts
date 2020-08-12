import { createEntityAdapter, createSelector } from "@reduxjs/toolkit"
import createCachedSelector from "re-reselect"
import { RootState } from "redux/redux/rootReducer"
import { TimeSpan } from "./types"
import { ActivityId } from "redux/ducks/activity/types"
import { TagId } from "redux/ducks/tag/types"

export const selecTimeSpanState = (state: RootState) => state.timeSpan

export const timeSpanAdapter = createEntityAdapter<TimeSpan>({
  sortComparer: ({ startTime: a }, { startTime: b }) =>
    a === b ? 0 : a < b ? 1 : -1,
})

const selectors = timeSpanAdapter.getSelectors(selecTimeSpanState)

export const {
  selectAll: selectTimespans,
  selectEntities: selectTimeSpanDictionary,
  selectById: selectTimeSpanById,
} = {
  ...selectors,
}

export const selectActiveTimespan = createSelector(
  selectTimespans,
  (spans) => spans[0],
)
const getTimespanIdsByActivityId = (spans: TimeSpan[], id: ActivityId) =>
  spans.filter((span) => span.activityId === id).map((s) => s.id)

export const selectTimespanIdsByActivityId = createCachedSelector(
  selectTimespans,
  (_: RootState, id: ActivityId) => id,
  getTimespanIdsByActivityId,
)((_: RootState, id) => id)

const getTimespanIdsByActivityIds = (spans: TimeSpan[], ids: ActivityId[]) =>
  spans.filter((span) => ids.includes(span.activityId)).map((s) => s.id)

export const selectTimespanIdsByActivityIds = createCachedSelector(
  selectTimespans,
  (_: RootState, ids: ActivityId[]) => ids,
  getTimespanIdsByActivityIds,
)((_: RootState, ids) => ids.reduce((a, b) => a + b, ""))

const getTimespanIdsByTagIds = (spans: TimeSpan[], ids: TagId[]) =>
  spans
    .filter(
      (span) =>
        span.tagIds &&
        span.tagIds.map((tagId) => ids.includes(tagId)).includes(true),
    )
    .map((s) => s.id)

export const selectTimespanIdsByTagIds = createCachedSelector(
  selectTimespans,
  (_: RootState, ids: TagId[]) => ids,
  getTimespanIdsByTagIds,
)((_: RootState, ids) => ids.reduce((a, b) => a + b, ""))
