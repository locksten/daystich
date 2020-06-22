import {
  createAction,
  createEntityAdapter,
  createSelector,
  createSlice,
  Dictionary,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit"
import { Color, Id } from "common"
import { Activity } from "ducks/activity"
import {
  defaultTagColor,
  isRootActivity,
  isRootActivityId,
  rootActivityTag,
} from "ducks/common"
import { RootState } from "ducks/redux/rootReducer"
import createCachedSelector from "re-reselect"
import {
  addActivity,
  updateActivity,
  removeActivity,
  AppPrepareAction,
} from "ducks/actions"

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
    addTag: adapter.addOne,
    removeTag(state, { payload: { id } }: PayloadAction<Pick<Tag, "id">>) {
      adapter.removeOne(state, id)
    },
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
    builder.addCase(addActivity, (state, { payload: { activityTag } }) => {
      adapter.addOne(state, activityTag)
    })
    builder.addCase(
      updateActivity,
      (state, { payload: { id, activityTag } }) => {
        adapter.updateOne(state, { id, changes: activityTag })
      },
    )
    builder.addCase(removeActivity, (state, { payload: { id } }) => {
      adapter.removeOne(state, id)
    })
  },
})

export const tagReducer = tagSlice.reducer

export const { removeTag, updateTag } = {
  ...tagSlice.actions,
}

export const addTag = createAction<AppPrepareAction<Omit<Tag, "id">, Tag>>(
  tagSlice.actions.addTag.type,
  (tag) => ({
    payload: {
      ...tag,
      id: nanoid(),
    },
  }),
)

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
