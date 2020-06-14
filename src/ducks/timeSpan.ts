import {
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit"
import { Duration, Id, Timestamp } from "common"
import { RootState } from "ducks/redux/rootReducer"
import { useDispatch } from "react-redux"

export type TimeSpan = {
  id: Id
  mainTagId: Id
  tagIds: Id[]
  startTime: Timestamp
  endTime?: Timestamp
  duration?: Duration
}

const adapter = createEntityAdapter<TimeSpan>({
  sortComparer: ({ startTime: a }, { startTime: b }) =>
    a === b ? 0 : a < b ? 1 : -1,
})

const selecTimeSpanState = (state: RootState) => state.timeSpans

const selectors = adapter.getSelectors(selecTimeSpanState)

const timeSpanDuration = (span: TimeSpan) =>
  span.endTime && span.endTime - span.startTime + 1

const timeSpansSlice = createSlice({
  name: "timeSpan",
  initialState: adapter.getInitialState(),
  reducers: {
    addTestTimeSpans: (state, { payload: mainTagIds }: PayloadAction<Id[]>) => {
      const start = 1000
      for (let i = start + 2000; i < start + 2100; i += 9) {
        const mainTagId = mainTagIds[i % mainTagIds.length]
        const newSpanId = String(i)
        adapter.addOne(state, {
          id: newSpanId,
          startTime: Number(newSpanId),
          mainTagId,
          duration: 9,
          endTime: i + 8,
          tagIds: [],
        })
      }
    },

    addTimeSpan: (
      state,
      {
        payload: { id: newSpanId, startTime: newStartTime, mainTagId, tagIds },
      }: PayloadAction<
        Pick<TimeSpan, "id" | "startTime" | "mainTagId" | "tagIds">
      >,
    ) => {
      const spans = adapter.getSelectors().selectAll(state)

      const spanBefore = spans.find((x) => x && x.startTime < newStartTime)
      const spanAfter = spans
        .slice()
        .reverse()
        .find((x) => x && x.startTime > newStartTime)

      const newSpan: TimeSpan = {
        id: newSpanId,
        startTime: newStartTime,
        endTime: spanAfter && spanAfter.startTime - 1,
        mainTagId,
        tagIds,
      }
      newSpan.duration = timeSpanDuration(newSpan)
      adapter.addOne(state, newSpan)

      if (spanBefore) {
        spanBefore.endTime = newSpan.startTime - 1
        spanBefore.duration = timeSpanDuration(spanBefore)
      }
    },
  },
})

export const selectActiveTimespan = createSelector(
  selectors.selectIds,
  selectors.selectEntities,
  (timeSpanIds, timeSpans) => timeSpans[timeSpanIds[0]],
)

export const {
  addTimeSpan,
  addTestTimeSpans,
  selectAll: selectTimespans,
  selectById: selectTimespanById,
} = { ...timeSpansSlice.actions, ...selectors }

export const useAddTimeSpanNow = () => {
  const dispatch = useDispatch()
  return (span: Pick<TimeSpan, "mainTagId" | "tagIds">) =>
    dispatch(
      addTimeSpan({
        id: nanoid(),
        mainTagId: span.mainTagId,
        startTime: Date.now(),
        tagIds: span.tagIds,
      }),
    )
}

export default timeSpansSlice.reducer
