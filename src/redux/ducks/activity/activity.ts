import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  detachTopLevelNestedOrderableFromParent,
  moveNestedOrderable,
  removeNestedOrderable,
  returnTopLevelNestedOrderableToParent,
} from "redux/common/nestedOrderable"
import { removeOneToManyRelation } from "redux/common/relations"
import {
  activityAdapter as adapter,
  selectActivityDescendantIds,
  selectActivityUsages,
} from "redux/ducks/activity/selectors"
import {
  Activity,
  ActivityId,
  generateActivityId,
} from "redux/ducks/activity/types"
import { removeTag } from "redux/ducks/tag/tag"
import { TimeSpanId } from "redux/ducks/timeSpan/types"
import { AppThunk } from "redux/redux/store"

const activitySlice = createSlice({
  name: "activity",
  initialState: adapter.getInitialState(),
  reducers: {
    addActivityAction: (
      state,
      {
        payload: { activity, move },
      }: PayloadAction<{
        activity: Pick<Activity, "_type" | "id" | "name" | "color" | "tagIds">
        move: Parameters<typeof moveNestedOrderable>[1]
      }>,
    ) => {
      adapter.addOne(state, activity)
      moveNestedOrderable(state, move)
    },
    updateActivity: (
      state,
      {
        payload: changes,
      }: PayloadAction<
        Pick<Activity, "id"> &
          Partial<Pick<Activity, "name" | "tagIds" | "color">>
      >,
    ) => {
      adapter.updateOne(state, { id: changes.id, changes })
    },
    moveActivityAction: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: ActivityId
        replacementParentId?: ActivityId
        parentOverrides?: Partial<Activity>
        to: Pick<Activity, "parentId" | "ordering" | "topLevelOrdering">
      }>,
    ) => {
      moveNestedOrderable(state, payload)
    },
    detachTopLevelActivityFromParent: (
      state,
      { payload: { id } }: PayloadAction<Pick<Activity, "id">>,
    ) => {
      detachTopLevelNestedOrderableFromParent(state, id)
    },
    returnTopLevelActivityToParent: (
      state,
      { payload: { id } }: PayloadAction<Pick<Activity, "id">>,
    ) => {
      returnTopLevelNestedOrderableToParent(state, id)
    },
    removeActivity: (
      state,
      {
        payload: { id, otherAffectedActivityIds },
      }: PayloadAction<
        Pick<Activity, "id"> & {
          otherAffectedActivityIds: ActivityId[]
          affectedTimeSpanIds: TimeSpanId[]
          replacementId?: ActivityId
        }
      >,
    ) => {
      removeNestedOrderable(state, id, otherAffectedActivityIds)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      removeTag,
      (
        state,
        {
          payload: {
            affectedActivityIds,
            id,
            otherAffectedTagIds,
            replacementId,
          },
        },
      ) => {
        removeOneToManyRelation(
          state,
          affectedActivityIds,
          "tagIds",
          [...otherAffectedTagIds, id],
          replacementId,
        )
      },
    )
  },
})

export const {
  addActivityAction,
  updateActivity,
  moveActivityAction,
  removeActivity,
  detachTopLevelActivityFromParent,
  returnTopLevelActivityToParent,
} = activitySlice.actions

export const activityReducer = activitySlice.reducer

export const addActivity = ({
  parentId,
  ...activity_
}: Pick<Activity, "parentId" | "name" | "color" | "tagIds">): AppThunk<{
  id: ActivityId
}> => (dispatch, s) => {
  const activity: Parameters<typeof addActivityAction>[0]["activity"] = {
    ...activity_,
    _type: "activity",
    id: generateActivityId(),
  }

  const { isInUse } = selectActivityUsages(s(), parentId)
  const replacementParentId = isInUse ? generateActivityId() : undefined

  dispatch(
    addActivityAction({
      activity,
      move: {
        id: activity.id,
        to: {
          parentId: parentId,
          ...(parentId ? { ordering: -1 } : { topLevelOrdering: -1 }),
        },
        replacementParentId,
        parentOverrides: { color: undefined, tagIds: undefined } as Partial<
          Activity
        >,
      },
    }),
  )

  return { id: activity.id }
}

export const moveActivity = ({
  id,
  to,
}: {
  id: ActivityId
  to: Pick<Activity, "parentId" | "ordering" | "topLevelOrdering">
}): AppThunk => (dispatch, s) => {
  const { isInUse } = selectActivityUsages(s(), to.parentId)
  const replacementParentId = isInUse ? generateActivityId() : undefined

  const descendants = selectActivityDescendantIds(s(), id)
  if (to.parentId && descendants.includes(to.parentId)) return

  dispatch(
    moveActivityAction({
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
      parentOverrides: { color: undefined } as Partial<Activity>,
    }),
  )
}
