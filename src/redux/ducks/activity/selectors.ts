import { createEntityAdapter } from "@reduxjs/toolkit"
import createCachedSelector from "re-reselect"
import { Color } from "styling/color"
import { Activity, ActivityId } from "redux/ducks/activity/types"
import { selectTimespanIdsByActivityIds } from "redux/ducks/timeSpan/selectors"
import { TimeSpanId } from "redux/ducks/timeSpan/types"
import { RootState } from "redux/redux/rootReducer"
import { defaultActivityColor } from "styling/color"
import { makeHierarchySelectors } from "../../common/hierarchySelectors"
import {
  makeNestedOrderableTreeListSelector,
  makeTopLevelEntityIdsSelector,
} from "redux/common/nestedOrderable"
import { TagId } from "redux/ducks/tag/types"

export const selectActivityState = (state: RootState) => state.activity

export const activityAdapter = createEntityAdapter<Activity>()

const selectors = activityAdapter.getSelectors(selectActivityState)

export const {
  selectAll: selectActivities,
  selectEntities: selectActivityDictionary,
} = {
  ...selectors,
}

export const selectActivityById = (state: RootState, id?: ActivityId) =>
  selectors.selectById(state, id ?? "")

const getActivityIdsByTagIds = (activities: Activity[], ids: TagId[]) =>
  activities
    .filter(
      (activity) =>
        activity.tagIds &&
        activity.tagIds.map((tagId) => ids.includes(tagId)).includes(true),
    )
    .map((s) => s.id)

export const selectActivityIdsByTagIds = createCachedSelector(
  selectActivities,
  (_: RootState, ids: TagId[]) => ids,
  getActivityIdsByTagIds,
)((_: RootState, ids) => ids.reduce((a, b) => a + b, ""))

export const selectActivitiesUsages = createCachedSelector(
  selectTimespanIdsByActivityIds,
  (_: RootState, ids: ActivityId[]) => ids,
  (timeSpanIds: TimeSpanId[], _activityIds: ActivityId[]) => ({
    timeSpanIds,
    isInUse: timeSpanIds.length !== 0,
  }),
)((_: RootState, ids) => ids.reduce((a, b) => a + b, ""))

export const selectActivityUsages = (state: RootState, id?: ActivityId) =>
  selectActivitiesUsages(state, id ? [id] : [])

const hierarhcySelectors = makeHierarchySelectors(selectors)
export const {
  selectChildren: selectActivityChildren,
  selectDescendantIds: selectActivityDescendantIds,
} = hierarhcySelectors

export const selectActivityColor = hierarhcySelectors.selectInheritedProperty<
  Color
>("color", defaultActivityColor)

export const selectActivityTreeList = makeNestedOrderableTreeListSelector(
  selectActivities,
  selectActivityDictionary,
)

export const selectTopLevelActivityIdsSelector = makeTopLevelEntityIdsSelector(
  selectActivities,
)
