import { Id } from "common"
import { selectActivityDictionary } from "redux/ducks/activity"
import {
  mainActivityListAdapter,
  selectMainActivityListState,
} from "redux/ducks/mainActivityList"
import {
  mainTagListAdapter,
  selectMainTagListState,
} from "redux/ducks/mainTagList"
import { RootState } from "redux/redux/rootReducer"
import {
  getTagChildren,
  getTagChildrenIds,
  selectTagDictionary,
  selectTags,
  selectTagState,
  Tag,
  tagAdapter,
  TreeNode,
} from "redux/ducks/tag"
import createCachedSelector from "re-reselect"
import { createSelector } from "reselect"

export const selectTagTreeList = createCachedSelector(
  selectTags,
  selectTagDictionary,
  selectActivityDictionary,
  (_: RootState, id: Id) => id,
  (tags, tagDict, activityDict, id) => {
    const getChildren = (tag: Tag): TreeNode => {
      const children = getTagChildrenIds(tags, tag.id).map((id) => tagDict[id]!)
      return {
        tag,
        activity: activityDict[tag.id],
        children: children.map((c) => getChildren(c)),
        hasTopLevelChildren: false,
      }
    }
    return [getChildren(tagDict[id]!)]
  },
)((_: RootState, id) => id)

export const selectMainActivityTreeList = createSelector(
  selectTagState,
  selectActivityDictionary,
  selectMainActivityListState,
  (tagState, activityDict, mainActivityListState): TreeNode[] => {
    const tagDict = tagAdapter.getSelectors().selectEntities(tagState)
    const tags = tagAdapter.getSelectors().selectAll(tagState)
    const mainAcitvityListDict = mainActivityListAdapter
      .getSelectors()
      .selectEntities(mainActivityListState)
    const mainAcitvityListEntries = mainActivityListAdapter
      .getSelectors()
      .selectAll(mainActivityListState)
    const topLevelActivityListIds = mainActivityListAdapter
      .getSelectors()
      .selectIds(mainActivityListState)

    const getNode = (id: Id): TreeNode => {
      const allChildren = getTagChildren(tags, id)
      const nonTopLevelChildren = allChildren
        .filter(({ id }) => !topLevelActivityListIds.includes(id))
        .map(({ id }) => getNode(id))
      return {
        tag: tagDict[id]!,
        activity: activityDict[id],
        mainListOrdering: mainAcitvityListDict[id]?.ordering,
        children: nonTopLevelChildren,
        hasTopLevelChildren: allChildren.length > nonTopLevelChildren.length,
      }
    }

    return mainAcitvityListEntries.map(({ id }) => getNode(id))
  },
)

export const selectMainTagTreeList = createSelector(
  selectTagState,
  selectMainTagListState,
  (tagState, mainTagListState): TreeNode[] => {
    const tagDict = tagAdapter.getSelectors().selectEntities(tagState)
    const tags = tagAdapter.getSelectors().selectAll(tagState)
    const mainTagListDict = mainTagListAdapter
      .getSelectors()
      .selectEntities(mainTagListState)
    const mainTagListEntries = mainTagListAdapter
      .getSelectors()
      .selectAll(mainTagListState)
    const topLevelTagListIds = mainTagListAdapter
      .getSelectors()
      .selectIds(mainTagListState)

    const getNode = (id: Id): TreeNode => {
      const allChildren = getTagChildren(tags, id)
      const nonTopLevelChildren = allChildren
        .filter(({ id }) => !topLevelTagListIds.includes(id))
        .map(({ id }) => getNode(id))
      return {
        tag: tagDict[id]!,
        activity: undefined,
        mainListOrdering: mainTagListDict[id]?.ordering,
        children: nonTopLevelChildren,
        hasTopLevelChildren: allChildren.length > nonTopLevelChildren.length,
      }
    }

    return mainTagListEntries.map(({ id }) => getNode(id))
  },
)
