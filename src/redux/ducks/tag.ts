import { createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit"
import { Color, Id } from "common"
import createCachedSelector from "re-reselect"
import {
  defaultTagColor,
  isRootActivityId,
  rootActivityTag,
} from "redux/common"
import { Activity, selectActivityIdsByTagIds } from "redux/ducks/activity"
import {
  addActivity,
  addTag,
  moveActivity,
  moveTag,
  removeActivity,
  removeTag,
  updateActivity,
  updateTag,
} from "redux/ducks/shared/actions"
import { selectTimespanIdsByTagIds } from "redux/ducks/timeSpan"
import { moveOneOrderable, removeOneOrderable } from "redux/ordering"
import { RootState, useAppSelector } from "redux/redux/rootReducer"

export type Tag = {
  id: Id
  parentTagId?: Id
  name: string
  color?: Color
  ordering: number
}

export const selectTagState = (state: RootState) => state.tag

const adapter = createEntityAdapter<Tag>({
  sortComparer: (a, b) => a.ordering - b.ordering,
})
export const tagAdapter = adapter

const selectors = adapter.getSelectors(selectTagState)

const initialState = adapter.addOne(adapter.getInitialState(), rootActivityTag)

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateTag, (state, { payload: tag }) => {
      adapter.updateOne(state, { id: tag.id, changes: tag })
    })
    builder.addCase(
      updateActivity,
      (state, { payload: { id, activityTag } }) => {
        adapter.updateOne(state, { id, changes: activityTag })
      },
    )
    builder.addCase(
      addTag,
      (state, { payload: { tag, additionalParentId } }) => {
        addOrMoveTagOrActivity(
          state,
          tag,
          tag.parentTagId,
          undefined,
          additionalParentId,
        )
      },
    )
    builder.addCase(
      addActivity,
      (state, { payload: { activityTag, additionalParentId } }) => {
        addOrMoveTagOrActivity(
          state,
          activityTag,
          activityTag.parentTagId,
          undefined,
          additionalParentId,
        )
      },
    )
    builder.addCase(removeTag, (state, { payload: { id, affectedTagIds } }) => {
      const tag = adapter.getSelectors().selectById(state, id)!
      removeOneOrderable(
        state,
        adapter,
        id,
        (t) => t.parentTagId === tag?.parentTagId,
      )
      adapter.removeMany(state, affectedTagIds)
    })
    builder.addCase(
      removeActivity,
      (state, { payload: { id, affectedActivityIds } }) => {
        const tag = adapter.getSelectors().selectById(state, id)!
        removeOneOrderable(
          state,
          adapter,
          id,
          (t) => t.parentTagId === tag?.parentTagId,
        )
        adapter.removeMany(state, affectedActivityIds)
      },
    )
    builder.addCase(
      moveTag,
      (
        state,
        { payload: { id, newParentId, newPosition, additionalParentId } },
      ) => {
        if (newParentId === undefined) {
          if (newPosition === undefined) {
            adapter.updateOne(state, {
              id,
              changes: { parentTagId: newParentId },
            })
          }
        } else {
          const tag = adapter.getSelectors().selectById(state, id)!
          addOrMoveTagOrActivity(
            state,
            tag,
            newParentId,
            newPosition,
            additionalParentId,
          )
        }
      },
    )
    builder.addCase(
      moveActivity,
      (
        state,
        { payload: { id, newParentId, newPosition, additionalParentId } },
      ) => {
        if (isRootActivityId(newParentId)) {
          if (newPosition === undefined) {
            adapter.updateOne(state, {
              id,
              changes: { parentTagId: newParentId },
            })
          }
        } else {
          const tag = adapter.getSelectors().selectById(state, id)!
          addOrMoveTagOrActivity(
            state,
            tag,
            newParentId,
            newPosition,
            additionalParentId,
          )
        }
      },
    )
  },
})

const addOrMoveTagOrActivity = (
  state: EntityState<Tag>,
  tag: Omit<Tag, "ordering">,
  newParentId?: Id,
  newPosition?: number,
  additionalParentId?: Id,
) => {
  const parent = adapter.getSelectors().selectById(state, newParentId!)
  if (additionalParentId && parent) {
    adapter.addOne(state, { ...parent, id: additionalParentId })
    adapter.updateOne(state, {
      id: parent.id,
      changes: {
        parentTagId: additionalParentId,
        color: undefined,
        ordering: 0,
      },
    })
  }
  moveOneOrderable(
    state,
    adapter,
    { ...tag, parentTagId: additionalParentId ?? newParentId } as Tag,
    newPosition ?? 0,
    (t) => t.parentTagId === tag.parentTagId,
    (t) => t.parentTagId === (additionalParentId ?? newParentId),
  )
}

export const tagReducer = tagSlice.reducer

// export const {} = {
//   ...tagSlice.actions,
// }

export const {
  selectAll: selectTags,
  selectEntities: selectTagDictionary,
  selectById: selectTagById,
} = {
  ...selectors,
}

export const isRootTag = (tag: { parentTagId?: Id }) => !tag?.parentTagId

export const getRootTagId = (state: EntityState<Tag>, id: Id) => {
  const tags = adapter.getSelectors().selectEntities(state)
  const findRootTag = (id: Id): Id => {
    const parentId = tags[id]?.parentTagId
    return parentId ? findRootTag(parentId) : id
  }
  return findRootTag(id)
}

export const selectRootTagId = createCachedSelector(
  selectTagState,
  (_: RootState, id: Id) => id,
  getRootTagId,
)((_: RootState, id) => id)

export const getTagChildren = (tags: Tag[], id: Id) =>
  tags.filter((tag) => tag?.parentTagId === id)

export const getTagChildrenIds = (tags: Tag[], id: Id) =>
  getTagChildren(tags, id).map((tag) => tag.id)

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

export const isActivity = (state: EntityState<Tag>, id: Id) =>
  isRootActivityId(getRootTagId(state, id))

export type TreeNode = {
  activity?: Activity
  tag: Tag
  mainListOrdering?: number
  children: TreeNode[]
  hasTopLevelChildren: boolean
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
    isInUse: activityIds.length !== 0 || timeSpanIds.length !== 0,
  }
}

export const useSelectTagUsages = (id?: Id) =>
  useSelectTagsUsages(id ? [id] : [])

// export const selectTagIdPath = createCachedSelector(
//   selectTagDictionary,
//   (_: RootState, id: Id) => id,
//   (tags, id) => {
//     const path = [id]
//     const getParentId = (id: Id) => {
//       const parentId = tags[id]?.parentTagId
//       if (parentId) {
//         path.push(parentId)
//         getParentId(parentId)
//       }
//     }
//     getParentId(id)
//     return path
//   },
// )((_: RootState, id) => id)

// export const isNonActivityRootTag = (tag: Tag) =>
//   isRootTag(tag) && !isRootActivity(tag)

// export const selectRootTagIds = createSelector(selectTags, (tags) =>
//   tags.filter(isRootTag).map((tag) => tag.id),
// )

// export const selectNonActivityRootTagIds = createSelector(selectTags, (tags) =>
//   tags.filter(isNonActivityRootTag).map((tag) => tag.id),
// )
