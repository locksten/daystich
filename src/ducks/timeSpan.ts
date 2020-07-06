import {
  createAction,
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit"
import { Duration, Id, Timestamp } from "common"
import { RootState } from "ducks/redux/rootReducer"
import { AppPrepareAction, removeActivity } from "ducks/actions"
import createCachedSelector from "re-reselect"

export type TimeSpan = {
  id: Id
  activityId: Id
  tagIds: Id[]
  startTime: Timestamp
  endTime?: Timestamp
  duration?: Duration
}

const adapter = createEntityAdapter<TimeSpan>({
  sortComparer: ({ startTime: a }, { startTime: b }) =>
    a === b ? 0 : a < b ? 1 : -1,
})

const selecTimeSpanState = (state: RootState) => state.timeSpan

const selectors = adapter.getSelectors(selecTimeSpanState)

const timeSpanDuration = (span: TimeSpan) =>
  span.endTime && span.endTime - span.startTime + 1

const timeSpanSlice = createSlice({
  name: "timeSpan",
  initialState: adapter.getInitialState(),
  reducers: {
    addTestTimeSpans: (
      state,
      { payload: activityIds }: PayloadAction<Id[]>,
    ) => {
      const start = 1000
      for (let i = start + 2000; i < start + 2100; i += 9) {
        const activityId = activityIds[i % activityIds.length]
        const newSpanId = String(i)
        adapter.addOne(state, {
          id: newSpanId,
          startTime: Number(newSpanId),
          activityId: activityId,
          duration: 9,
          endTime: i + 8,
          tagIds: [],
        })
      }
    },
    addTimeSpan: (
      state,
      {
        payload: { id, startTime, activityId, tagIds },
      }: PayloadAction<
        Pick<TimeSpan, "id" | "startTime" | "activityId" | "tagIds">
      >,
    ) => {
      const spans = adapter.getSelectors().selectAll(state)

      const spanBefore = spans.find((x) => x && x.startTime < startTime)
      const spanAfter = spans
        .slice()
        .reverse()
        .find((x) => x && x.startTime > startTime)

      const newSpan: TimeSpan = {
        id,
        startTime,
        endTime: spanAfter && spanAfter.startTime - 1,
        activityId,
        tagIds,
      }
      newSpan.duration = timeSpanDuration(newSpan)
      adapter.addOne(state, newSpan)

      if (spanBefore) {
        spanBefore.endTime = newSpan.startTime - 1
        spanBefore.duration = timeSpanDuration(spanBefore)
      }
    },
    updateTimespan(
      state,
      {
        payload: span,
      }: PayloadAction<
        Pick<TimeSpan, "id"> & Partial<Pick<TimeSpan, "tagIds">>
      >,
    ) {
      adapter.updateOne(state, { id: span.id, changes: span })
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      removeActivity,
      (state, { payload: { affectedTimeSpanIds, replacementId } }) => {
        adapter.updateMany(
          state,
          affectedTimeSpanIds.map((id) => ({
            id,
            changes: { activityId: replacementId },
          })),
        )
      },
    )
  },
})

export const timeSpanReducer = timeSpanSlice.reducer

export const { addTimeSpan, updateTimespan, addTestTimeSpans } = {
  ...timeSpanSlice.actions,
}

export const addTimeSpanNow = createAction<
  AppPrepareAction<Pick<TimeSpan, "activityId">, TimeSpan>
>(addTimeSpan.type, ({ activityId }) => {
  return {
    payload: {
      id: nanoid(),
      activityId,
      startTime: Date.now(),
      tagIds: [],
    },
  }
})

export const {
  selectAll: selectTimespans,
  selectEntities: selectTimeSpanDictionary,
  selectById: selectTimespanById,
} = {
  ...selectors,
}

export const selectActiveTimespan = createSelector(
  selectTimespans,
  (spans) => spans[0],
)

const getTimespanIdsByActivityId = (spans: TimeSpan[], id: Id) =>
  spans.filter((span) => span.activityId === id).map((s) => s.id)

export const selectTimespanIdsByActivityId = createCachedSelector(
  selectTimespans,
  (_: RootState, id: Id) => id,
  getTimespanIdsByActivityId,
)((_: RootState, id) => id)

const getTimespanIdsByActivityIds = (spans: TimeSpan[], ids: Id[]) =>
  spans.filter((span) => ids.includes(span.activityId)).map((s) => s.id)

export const selectTimespanIdsByActivityIds = createCachedSelector(
  selectTimespans,
  (_: RootState, ids: Id[]) => ids,
  getTimespanIdsByActivityIds,
)((_: RootState, ids) => ids.reduce((a, b) => a + b, ""))
