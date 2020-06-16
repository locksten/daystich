import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import { Id } from "common"
import {
  addActivity,
  removeActivity,
  rootActivity,
  rootActivityId,
} from "ducks/redux/common"
import { RootState } from "ducks/redux/rootReducer"
import {
  getTagChildrenIdsFromTagDictionary,
  selectTagDictionary,
} from "ducks/tag"
import createCachedSelector from "re-reselect"

export type Activity = {
  id: Id
  tagIds: Id[]
  displayAtTopLevel: boolean
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
  selectActivityDictionary,
  selectTagDictionary,
  (activities, tags) => {
    const children = getTagChildrenIdsFromTagDictionary(tags, rootActivityId)
    return Object.values(activities)
      .filter(
        (activity) =>
          activity!.displayAtTopLevel || children.includes(activity!.id),
      )
      .map((activity) => activity!.id)
  },
)

export const selectDisplayActivityChildrenIds = createCachedSelector(
  selectActivityDictionary,
  selectTagDictionary,
  (_: RootState, id: Id) => id,
  (activities, tags, id) => {
    const children = getTagChildrenIdsFromTagDictionary(tags, id)
    return Object.values(activities)
      .filter(
        (activity) =>
          !activity!.displayAtTopLevel && children.includes(activity!.id),
      )
      .map((activity) => activity!.id)
  },
)((_: RootState, id) => id)
