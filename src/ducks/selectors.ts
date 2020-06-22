import { selectActivityDictionary } from "ducks/activity"
import { rootActivityId } from "ducks/common"
import {
  getDisplayTagChildrenIds,
  getDisplayTagTreeList,
  selectNonActivityRootTagIds,
  selectTagDictionary,
  selectTags,
  Tag,
  TreeNode,
  getTagChildrenIds,
} from "ducks/tag"
import { createSelector } from "reselect"
import createCachedSelector from "re-reselect"
import { RootState } from "ducks/redux/rootReducer"
import { Id } from "common"

export const selectTopLevelDisplayTagTreeList = createSelector(
  selectTags,
  selectTagDictionary,
  selectActivityDictionary,
  selectNonActivityRootTagIds,
  (tags, tagDict, activityDict, rootTagIds) =>
    rootTagIds.flatMap((id) =>
      getDisplayTagTreeList(tags, tagDict, activityDict, id),
    ),
)

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
      }
    }
    return [getChildren(tagDict[id]!)]
  },
)((_: RootState, id) => id)

export const selectDisplayTopLevelActivityTreeList = createSelector(
  selectTags,
  selectTagDictionary,
  selectActivityDictionary,
  (tags, tagDict, activityDict) => {
    const children = getDisplayTagChildrenIds(tags, rootActivityId)
    return children.flatMap((id) =>
      getDisplayTagTreeList(tags, tagDict, activityDict, id),
    )
  },
)
