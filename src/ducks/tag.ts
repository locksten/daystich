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
import {
  addActivity,
  AppPrepareAction,
  defaultTagColor,
  removeActivity,
  rootActivityTag,
  updateActivity,
} from "ducks/redux/common"
import { RootState } from "ducks/redux/rootReducer"
import createCachedSelector from "re-reselect"

export type Tag = {
  id: Id
  parentTagId?: Id
  name: string
  color?: Color
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

export const selectRootTagIds = createSelector(selectTagDictionary, (tags) =>
  Object.values(tags)
    .filter((tag) => !tag?.parentTagId)
    .map((tag) => tag!.id),
)

export const selectRootTagId = createCachedSelector(
  selectTagDictionary,
  (_: RootState, id: Id) => id,
  (tags, id): Id => {
    const findRootTag = (id: Id): Id => {
      const parentId = tags[id]?.parentTagId
      return parentId ? findRootTag(parentId) : id
    }
    return findRootTag(id)
  },
)((_: RootState, id) => id)

export const getTagChildrenIdsFromTagDictionary = (
  tags: Dictionary<Tag>,
  id: Id,
) =>
  Object.values(tags)
    .filter((tag) => tag?.parentTagId === id)
    .map((tag) => tag!.id)

export const selectTagChildrenIds = createCachedSelector(
  selectTagDictionary,
  (_: RootState, id: Id) => id,
  getTagChildrenIdsFromTagDictionary,
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
