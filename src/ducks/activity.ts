import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import { Id } from "common"
import { isRootActivityId, rootActivity } from "ducks/common"
import { RootState } from "ducks/redux/rootReducer"
import { selectTags, isActivity, selectTagDictionary } from "ducks/tag"
import { addActivity, updateActivity, removeActivity } from "ducks/actions"

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
    builder.addCase(addActivity, (state, { payload: { activity } }) => {
      adapter.addOne(state, activity)
    })
    builder.addCase(updateActivity, (state, { payload: { id, activity } }) => {
      adapter.updateOne(state, { id, changes: activity })
    })
    builder.addCase(removeActivity, (state, { payload: { id } }) => {
      adapter.removeOne(state, id)
    })
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
