import { createEntityAdapter } from "@reduxjs/toolkit"
import createCachedSelector from "re-reselect"
import { Color } from "styling/color"
import { selectTimespanIdsByTagIds } from "redux/ducks/timeSpan/selectors"
import { TimeSpanId } from "redux/ducks/timeSpan/types"
import { RootState } from "redux/redux/rootReducer"
import { defaultTagColor } from "styling/color"
import { makeHierarchySelectors } from "../../common/hierarchySelectors"
import {
  makeNestedOrderableTreeListSelector,
  makeTopLevelEntityIdsSelector,
} from "redux/common/nestedOrderable"
import { selectActivityIdsByTagIds } from "redux/ducks/activity/selectors"
import { Tag, TagId } from "redux/ducks/tag/types"
import { ActivityId } from "redux/ducks/activity/types"

export const selectTagState = (state: RootState) => state.tag

export const tagAdapter = createEntityAdapter<Tag>()

const selectors = tagAdapter.getSelectors(selectTagState)

export const { selectAll: selectTags, selectEntities: selectTagDictionary } = {
  ...selectors,
}

export const selectTagById = (state: RootState, id?: TagId) =>
  selectors.selectById(state, id ?? "")

export const selectTagsUsages = createCachedSelector(
  selectTimespanIdsByTagIds,
  selectActivityIdsByTagIds,
  (_: RootState, tagIds: TagId[]) => tagIds,
  (timeSpanIds: TimeSpanId[], activityIds: ActivityId[], _tagIds: TagId[]) => ({
    activityIds,
    timeSpanIds,
    isInUse: activityIds.length !== 0 || timeSpanIds.length !== 0,
  }),
)((_: RootState, ids) => ids.reduce((a, b) => a + b, ""))

export const selectTagUsages = (state: RootState, id?: TagId) =>
  selectTagsUsages(state, id ? [id] : [])

const hierarhcySelectors = makeHierarchySelectors(selectors)
export const {
  selectChildren: selectTagChildren,
  selectDescendantIds: selectTagDescendantIds,
} = hierarhcySelectors

export const selectTagColor = hierarhcySelectors.selectInheritedProperty<Color>(
  "color",
  defaultTagColor,
)

export const selectTagTreeList = makeNestedOrderableTreeListSelector(
  selectTags,
  selectTagDictionary,
)

export const selectTopLevelTagIds = makeTopLevelEntityIdsSelector(selectTags)
