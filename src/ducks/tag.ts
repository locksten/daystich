import {
  createEntityAdapter,
  createSelector,
  createSlice,
  Dictionary,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit"
import { Color, Id } from "common"
import {
  addActivity,
  addTag,
  removeActivity,
  removeTag,
  updateActivity,
} from "ducks/actions"
import { Activity, selectActivityIdsByTagIds } from "ducks/activity"
import {
  defaultTagColor,
  isRootActivity,
  isRootActivityId,
  rootActivityTag,
} from "ducks/common"
import { RootState, useAppSelector } from "ducks/redux/rootReducer"
import { selectTimespanIdsByTagIds } from "ducks/timeSpan"
import createCachedSelector from "re-reselect"

export type Tag = {
  id: Id
  parentTagId?: Id
  name: string
  color?: Color
  displayAtTopLevel: boolean
}

const selectTagState = (state: RootState) => state.tag

const adapter = createEntityAdapter<Tag>()

const selectors = adapter.getSelectors(selectTagState)

const initialState = adapter.addOne(adapter.getInitialState(), rootActivityTag)

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {
    updateTag(
      state,
      {
        payload: tag,
      }: PayloadAction<Pick<Tag, "id"> & Partial<Pick<Tag, "name" | "color">>>,
    ) {
      adapter.updateOne(state, { id: tag.id, changes: tag })
    },
  },

  extraReducers: (builder) => {
    builder.addCase(addTag, (state, { payload: { tag, newParentId } }) => {
      addTagOrActivity(state, tag, newParentId)
    })
    builder.addCase(
      addActivity,
      (state, { payload: { activityTag, newParentId } }) => {
        addTagOrActivity(state, activityTag, newParentId)
      },
    )
    builder.addCase(
      updateActivity,
      (state, { payload: { id, activityTag } }) => {
        adapter.updateOne(state, { id, changes: activityTag })
      },
    )
    builder.addCase(
      removeActivity,
      (state, { payload: { affectedActivityIds } }) => {
        adapter.removeMany(state, affectedActivityIds)
      },
    )
    builder.addCase(removeTag, (state, { payload: { affectedTagIds } }) => {
      adapter.removeMany(state, affectedTagIds)
    })
  },
})

const addTagOrActivity = (
  state: EntityState<Tag>,
  tag: Tag,
  newParentId?: Id,
) => {
  if (newParentId) {
    const parent = adapter.getSelectors().selectById(state, tag.parentTagId!)!
    const newParent = { ...parent, id: newParentId }
    adapter.addOne(state, newParent)
    adapter.updateOne(state, {
      id: parent.id,
      changes: {
        parentTagId: newParent.id,
        displayAtTopLevel: false,
        color: undefined,
      },
    })
    adapter.addOne(state, { ...tag, parentTagId: newParent.id })
  } else {
    adapter.addOne(state, tag)
  }
}

export const tagReducer = tagSlice.reducer

export const { updateTag } = {
  ...tagSlice.actions,
}

export const {
  selectAll: selectTags,
  selectEntities: selectTagDictionary,
  selectById: selectTagById,
} = {
  ...selectors,
}

export const isRootTag = (tag: Tag) => !tag?.parentTagId

export const isNonActivityRootTag = (tag: Tag) =>
  isRootTag(tag) && !isRootActivity(tag)

export const selectRootTagIds = createSelector(selectTags, (tags) =>
  tags.filter(isRootTag).map((tag) => tag.id),
)

export const selectNonActivityRootTagIds = createSelector(selectTags, (tags) =>
  tags.filter(isNonActivityRootTag).map((tag) => tag.id),
)

export const getRootTagId = (tags: Dictionary<Tag>, id: Id) => {
  const findRootTag = (id: Id): Id => {
    const parentId = tags[id]?.parentTagId
    return parentId ? findRootTag(parentId) : id
  }
  return findRootTag(id)
}

export const selectTagIdPath = createCachedSelector(
  selectTagDictionary,
  (_: RootState, id: Id) => id,
  (tags, id) => {
    const path = [id]
    const getParentId = (id: Id) => {
      const parentId = tags[id]?.parentTagId
      if (parentId) {
        path.push(parentId)
        getParentId(parentId)
      }
    }
    getParentId(id)
    return path
  },
)((_: RootState, id) => id)

export const selectRootTagId = createCachedSelector(
  selectTagDictionary,
  (_: RootState, id: Id) => id,
  getRootTagId,
)((_: RootState, id) => id)

export const getTagChildrenIds = (tags: Tag[], id: Id) =>
  tags.filter((tag) => tag?.parentTagId === id).map((tag) => tag.id)

export const selectTagChildrenIds = createCachedSelector(
  selectTags,
  (_: RootState, id: Id) => id,
  getTagChildrenIds,
)((_: RootState, id) => id)

export const selectTagColor = createCachedSelector(
  selectTagDictionary,
  (_: RootState, id: Id) => id,
  (tags, id): Id => {
    const findTagColor = (tagId: Id): Id => {
      const tag = tags[tagId]!
      const parentId = tags[tagId]?.parentTagId
      const parent = parentId ? tags[parentId] : undefined
      return tag?.color
        ? tag.color
        : parent
        ? findTagColor(parent.id)
        : defaultTagColor
    }
    return findTagColor(id)
  },
)((_: RootState, id) => id)

export const isActivity = (tagDictionary: Dictionary<Tag>, id: Id) =>
  isRootActivityId(getRootTagId(tagDictionary, id))

export const selectTopLevelDisplayTagIds = createSelector(
  selectTagDictionary,
  (tags) =>
    Object.values(tags)
      .filter(
        (tag) =>
          !isActivity(tags, tag!.id) &&
          (tag!.displayAtTopLevel || isRootTag(tag!)),
      )
      .map((tag) => tag!.id),
)

export const getDisplayTagChildrenIds = (tags: Tag[], id: Id) => {
  return tags
    .filter((tag) => !tag.displayAtTopLevel && tag?.parentTagId === id)
    .map((tag) => tag.id)
}

export type TreeNode = { activity?: Activity; tag: Tag; children: TreeNode[] }

export const getDisplayTagTreeList = (
  tags: Tag[],
  tagDict: Dictionary<Tag>,
  activityDict: Dictionary<Activity>,
  rootId: Id,
) => {
  const topLevel: TreeNode[] = []
  const getChildren = (tag: Tag): TreeNode => {
    const children = getTagChildrenIds(tags, tag.id)
      .map((id) => tagDict[id]!)
      .filter((c) =>
        c.displayAtTopLevel ? topLevel.push(getChildren(c)) && false : true,
      )
    return {
      tag,
      activity: activityDict[tag.id],
      children: children.map((c) => getChildren(c)),
    }
  }

  const children = getChildren(tagDict[rootId]!)

  return [...topLevel, children]
}

export const getTagDescendantIds = (tags: Tag[], id: Id) => {
  const descendantIds: Id[] = []
  const getChildren = (id: Id) => {
    const childrenIds = getTagChildrenIds(tags, id)
    descendantIds.push(...childrenIds)
    childrenIds.map((id) => getChildren(id))
  }
  getChildren(id)
  return descendantIds
}

export const selectTagDescendantIds = createCachedSelector(
  selectTags,
  (_: RootState, id: Id) => id,
  getTagDescendantIds,
)((_: RootState, id) => id)

export const useSelectTagsUsages = (ids: Id[]) => {
  const activityIds = useAppSelector((s) => selectActivityIdsByTagIds(s, ids))
  const timeSpanIds = useAppSelector((s) => selectTimespanIdsByTagIds(s, ids))
  return {
    activityIds,
    timeSpanIds,
    inUse: activityIds.length !== 0 || timeSpanIds.length !== 0,
  }
}

export const useSelectTagUsages = (id?: Id) =>
  useSelectTagsUsages(id ? [id] : [])
