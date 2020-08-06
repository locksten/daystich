import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { Id } from "common/common"
import createCachedSelector from "re-reselect"
import {
  addActivity,
  moveActivity,
  removeActivity,
  removeTag,
  updateActivity,
} from "redux/ducks/shared/actions"
import { rootActivity } from "redux/ducks/shared/treeNodeRoots"
import { selectTimespanIdsByActivityIds } from "redux/ducks/timeSpan"
import { RootState, useAppSelector } from "redux/redux/rootReducer"
import { removeOneToManyRelation } from "redux/relations"

export type Activity = {
  id: Id
  tagIds: Id[]
}

const selectActivityState = (state: RootState) => state.activity

const adapter = createEntityAdapter<Activity>()

const selectors = adapter.getSelectors(selectActivityState)

const initialState = adapter.addOne(adapter.getInitialState(), rootActivity)

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      addActivity,
      (state, { payload: { activity, activityTag, additionalParentId } }) => {
        adapter.addOne(state, activity)
        if (additionalParentId) {
          const parent = adapter
            .getSelectors()
            .selectById(state, activityTag.parentTagId!)!
          adapter.addOne(state, { ...parent, id: additionalParentId })
        }
      },
    )
    builder.addCase(
      moveActivity,
      (state, { payload: { newParentId, additionalParentId } }) => {
        if (additionalParentId) {
          const parent = adapter.getSelectors().selectById(state, newParentId!)!
          adapter.addOne(state, { ...parent, id: additionalParentId })
        }
      },
    )
    builder.addCase(updateActivity, (state, { payload: { id, activity } }) => {
      adapter.updateOne(state, { id, changes: activity })
    })
    builder.addCase(
      removeActivity,
      (state, { payload: { affectedActivityIds } }) => {
        adapter.removeMany(state, affectedActivityIds)
      },
    )
    builder.addCase(
      removeTag,
      (
        state,
        { payload: { affectedTagIds, affectedActivityIds, replacementId } },
      ) => {
        removeOneToManyRelation(
          state,
          adapter,
          "tagIds",
          affectedActivityIds,
          affectedTagIds,
          replacementId,
        )
      },
    )
  },
})

export const activityReducer = activitySlice.reducer

// export const {} = {
//   ...activitySlice.actions,
// }

export const {
  selectAll: selectActivities,
  selectEntities: selectActivityDictionary,
  selectById: selectActivityById,
} = {
  ...selectors,
}

const getActivityIdsByTagIds = (activities: Activity[], ids: Id[]) =>
  activities
    .filter((activity) =>
      activity.tagIds.map((tagId) => ids.includes(tagId)).includes(true),
    )
    .map((s) => s.id)

export const selectActivityIdsByTagIds = createCachedSelector(
  selectActivities,
  (_: RootState, ids: Id[]) => ids,
  getActivityIdsByTagIds,
)((_: RootState, ids) => ids.reduce((a, b) => a + b, ""))

export const useSelectActivitiesUsages = (ids: Id[]) => {
  const timeSpanIds = useAppSelector((s) =>
    selectTimespanIdsByActivityIds(s, ids),
  )
  return {
    timeSpanIds,
    isInUse: timeSpanIds.length !== 0,
  }
}

export const useSelectActivityUsages = (id?: Id) =>
  useSelectActivitiesUsages(id ? [id] : [])
