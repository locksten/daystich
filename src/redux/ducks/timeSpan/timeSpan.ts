import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getCurrentTimestamp } from "common/time"
import { removeOneToManyRelation } from "redux/common/relations"
import { removeActivity } from "redux/ducks/activity/activity"
import { removeTag } from "redux/ducks/tag/tag"
import {
  generateTimeSpanId,
  TimeSpan,
  TimeSpanId,
} from "redux/ducks/timeSpan/types"
import { AppThunk } from "redux/redux/store"
import { timeSpanAdapter as adapter } from "./selectors"

const timeSpanSlice = createSlice({
  name: "timeSpan",
  initialState: adapter.getInitialState(),
  reducers: {
    addTimeSpanAction: (
      state,
      {
        payload: { startTime, ...span },
      }: PayloadAction<Omit<TimeSpan, "_type" | "duration" | "endTime">>,
    ) => {
      const spans = adapter.getSelectors().selectAll(state)

      const spanBefore = spans.find((x) => x && x.startTime < startTime)
      const spanAfter = spans
        .slice()
        .reverse()
        .find((x) => x && x.startTime > startTime)

      const timeSpanDuration = (span: TimeSpan) =>
        span.endTime && span.endTime - span.startTime + 1

      const newSpan = {
        ...span,
        _type: "timeSpan",
        startTime,
        endTime: spanAfter && spanAfter.startTime - 1,
      } as TimeSpan
      newSpan.duration = timeSpanDuration(newSpan)
      adapter.addOne(state, newSpan)

      if (spanBefore) {
        spanBefore.duration = timeSpanDuration(spanBefore)
      }
    },
    updateTimeSpan(
      state,
      {
        payload: span,
      }: PayloadAction<
        Pick<TimeSpan, "id"> & Partial<Pick<TimeSpan, "activityId" | "tagIds">>
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
    builder.addCase(
      removeTag,
      (
        state,
        {
          payload: {
            id,
            otherAffectedTagIds,
            affectedTimeSpanIds,
            replacementId,
          },
        },
      ) => {
        removeOneToManyRelation(
          state,
          affectedTimeSpanIds,
          "tagIds",
          [...otherAffectedTagIds, id],
          replacementId,
        )
      },
    )
  },
})

export const timeSpanReducer = timeSpanSlice.reducer

export const { updateTimeSpan, addTimeSpanAction } = {
  ...timeSpanSlice.actions,
}

export const addTimeSpan = (
  timeSpan: Omit<TimeSpan, "id" | "_type" | "duration" | "endTime">,
): AppThunk<{ id: TimeSpanId }> => (dispatch) => {
  const id = generateTimeSpanId()

  dispatch(
    addTimeSpanAction({
      ...timeSpan,
      id,
    }),
  )

  return { id }
}

export const addTimeSpanNow = (
  timeSpan: Omit<Parameters<typeof addTimeSpanAction>[0], "startTime" | "id">,
) => {
  return addTimeSpanAction({
    ...timeSpan,
    startTime: getCurrentTimestamp(),
    id: generateTimeSpanId(),
  })
}
