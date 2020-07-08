import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import { Id } from "common"
import {
  addActivity,
  removeActivity,
  removeTag,
  updateActivity,
} from "ducks/actions"
import {
  isRootActivityId,
  removeOneToManyRelation,
  rootActivity,
} from "ducks/common"
import { RootState, useAppSelector } from "ducks/redux/rootReducer"
import { isActivity, selectTagDictionary, selectTags } from "ducks/tag"
import { selectTimespanIdsByActivityIds } from "ducks/timeSpan"
import createCachedSelector from "re-reselect"

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
      (state, { payload: { activity, activityTag, newParentId } }) => {
        adapter.addOne(state, activity)
        if (newParentId) {
          const parent = adapter
            .getSelectors()
            .selectById(state, activityTag.parentTagId!)!
          adapter.addOne(state, { ...parent, id: newParentId })
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

export const selectTopLevelDisplayActivityIds = createSelector(
  selectTagDictionary,
  selectTags,
  (tagDict, tags) => {
    return tags
      .filter(
        (tag) =>
          (isActivity(tagDict, tag.id) && tag.displayAtTopLevel) ||
          isRootActivityId(tag?.parentTagId),
      )
      .map((tag) => tag.id)
  },
)

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
    inUse: timeSpanIds.length !== 0,
  }
}

export const useSelectActivityUsages = (id?: Id) =>
  useSelectActivitiesUsages(id ? [id] : [])
