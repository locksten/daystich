import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  detachTopLevelNestedOrderableFromParent,
  moveNestedOrderable,
  removeNestedOrderable,
  returnTopLevelNestedOrderableToParent,
} from "redux/common/nestedOrderable"
import { ActivityId } from "redux/ducks/activity/types"
import {
  selectTagDescendantIds,
  selectTagUsages,
  tagAdapter as adapter,
} from "redux/ducks/tag/selectors"
import { generateTagId, Tag, TagId } from "redux/ducks/tag/types"
import { TimeSpanId } from "redux/ducks/timeSpan/types"
import { AppThunk } from "redux/redux/store"

const tagSlice = createSlice({
  name: "tag",
  initialState: adapter.getInitialState(),
  reducers: {
    addTagAction: (
      state,
      {
        payload: { tag, move },
      }: PayloadAction<{
        tag: Pick<Tag, "_type" | "id" | "parentId" | "name" | "color">
        move: Parameters<typeof moveNestedOrderable>[1]
      }>,
    ) => {
      adapter.addOne(state, tag)
      moveNestedOrderable(state, move)
    },
    updateTag: (
      state,
      {
        payload: changes,
      }: PayloadAction<Pick<Tag, "id"> & Partial<Pick<Tag, "name" | "color">>>,
    ) => {
      adapter.updateOne(state, { id: changes.id, changes })
    },
    moveTagAction: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: TagId
        replacementParentId?: TagId
        parentOverrides?: Partial<Tag>
        to: Pick<Tag, "parentId" | "ordering" | "topLevelOrdering">
      }>,
    ) => {
      moveNestedOrderable(state, payload)
    },
    detachTopLevelTagFromParent: (
      state,
      { payload: { id } }: PayloadAction<Pick<Tag, "id">>,
    ) => {
      detachTopLevelNestedOrderableFromParent(state, id)
    },
    returnTopLevelTagToParent: (
      state,
      { payload: { id } }: PayloadAction<Pick<Tag, "id">>,
    ) => {
      returnTopLevelNestedOrderableToParent(state, id)
    },
    removeTag: (
      state,
      {
        payload: { id, otherAffectedTagIds },
      }: PayloadAction<
        Pick<Tag, "id"> & {
          otherAffectedTagIds: TagId[]
          affectedTimeSpanIds: TimeSpanId[]
          affectedActivityIds: ActivityId[]
          replacementId?: TagId
        }
      >,
    ) => {
      removeNestedOrderable(state, id, otherAffectedTagIds)
    },
  },
})

export const {
  addTagAction,
  updateTag,
  removeTag,
  moveTagAction,
  detachTopLevelTagFromParent,
  returnTopLevelTagToParent,
} = tagSlice.actions

export const tagReducer = tagSlice.reducer

export const addTag = ({
  parentId,
  ...tag_
}: Pick<Tag, "parentId" | "name" | "color">): AppThunk<{ id: TagId }> => (
  dispatch,
  s,
) => {
  const tag: Parameters<typeof addTagAction>[0]["tag"] = {
    ...tag_,
    _type: "tag",
    id: generateTagId(),
  }

  const { isInUse } = selectTagUsages(s(), parentId)
  const replacementParentId = isInUse ? generateTagId() : undefined

  dispatch(
    addTagAction({
      tag,
      move: {
        id: tag.id,
        to: {
          parentId: parentId,
          ...(parentId ? { ordering: -1 } : { topLevelOrdering: -1 }),
        },
        replacementParentId,
        parentOverrides: { color: undefined } as Partial<Tag>,
      },
    }),
  )

  return { id: tag.id }
}

export const moveTag = ({
  id,
  to,
}: {
  id: TagId
  to: Pick<Tag, "parentId" | "ordering" | "topLevelOrdering">
}): AppThunk => (dispatch, s) => {
  const { isInUse } = selectTagUsages(s(), to.parentId)
  const replacementParentId = isInUse ? generateTagId() : undefined

  const descendants = selectTagDescendantIds(s(), id)
  if (to.parentId && descendants.includes(to.parentId)) return

  dispatch(
    moveTagAction({
      id,
      replacementParentId,
      to: {
        ...(to.parentId === undefined
          ? {
              topLevelOrdering: to.topLevelOrdering,
            }
          : {
              parentId: to.parentId,
              ordering: to.ordering,
              topLevelOrdering: undefined,
            }),
      },
      parentOverrides: { color: undefined } as Tag,
    }),
  )
}
