import { createAction, nanoid } from "@reduxjs/toolkit"
import { Activity } from "redux/ducks/activity"
import { Tag } from "redux/ducks/tag"
import { Id } from "common"

export declare type AppPrepareAction<A, P> = (
  arg: A,
) => {
  payload: P
}

export const addActivity = createAction<
  AppPrepareAction<
    {
      activity: Omit<Activity, "id">
      activityTag: Omit<Tag, "id" | "ordering">
      newParentIsTopLevel: boolean
      isInUse: boolean
    },
    {
      activity: Activity
      activityTag: Omit<Tag, "ordering">
      newParentIsTopLevel: boolean
      additionalParentId?: Id
    }
  >
>(
  "activity/addActivity",
  ({ activity, activityTag, isInUse, newParentIsTopLevel }) => {
    const id = nanoid()
    return {
      payload: {
        activity: { ...activity, id },
        activityTag: { ...activityTag, id },
        newParentIsTopLevel,
        additionalParentId: isInUse ? nanoid() : undefined,
      },
    }
  },
)

export type ActivtyChangesType = {
  id: Id
  activity: Partial<Pick<Activity, "tagIds">>
  activityTag: Partial<Pick<Tag, "name" | "color">>
}

export const updateActivity = createAction<ActivtyChangesType>(
  "activity/updateActivity",
)

export const moveActivity = createAction<
  AppPrepareAction<
    {
      id: Id
      newParentId?: Id
      newParentIsTopLevel: boolean
      newPosition?: number
      isInUse: boolean
    },
    {
      id: Id
      newParentId?: Id
      newParentIsTopLevel: boolean
      newPosition?: number
      additionalParentId?: Id
    }
  >
>("activity/moveActivity", ({ isInUse, ...payload }) => ({
  payload: {
    ...payload,
    additionalParentId: isInUse ? nanoid() : undefined,
  },
}))

export const moveTag = createAction<
  AppPrepareAction<
    {
      id: Id
      newParentId?: Id
      newPosition?: number
      isInUse: boolean
      newParentIsTopLevel: boolean
    },
    {
      id: Id
      newParentId?: Id
      newPosition?: number
      newParentIsTopLevel: boolean
      additionalParentId?: Id
    }
  >
>("tag/moveTag", ({ isInUse, ...payload }) => ({
  payload: {
    ...payload,
    additionalParentId: isInUse ? nanoid() : undefined,
  },
}))

export const removeActivity = createAction<
  Pick<Activity, "id"> & {
    affectedActivityIds: Id[]
    affectedTimeSpanIds: Id[]
    replacementId?: Id
  }
>("activity/removeActivity")

export const removeTag = createAction<
  Pick<Tag, "id"> & {
    affectedTagIds: Id[]
    affectedTimeSpanIds: Id[]
    affectedActivityIds: Id[]
    replacementId?: Id
  }
>("tag/removeTag")

export const updateTag = createAction<Pick<Tag, "id"> & Partial<Tag>>(
  "tag/updateTag",
)

export const addTag = createAction<
  AppPrepareAction<
    {
      tag: Omit<Tag, "id" | "ordering">
      isInUse: boolean
      newParentIsTopLevel: boolean
    },
    {
      tag: Omit<Tag, "ordering">
      additionalParentId?: Id
      newParentIsTopLevel: boolean
    }
  >
>("tag/addTag", ({ tag, isInUse, newParentIsTopLevel }) => ({
  payload: {
    tag: {
      ...tag,
      id: nanoid(),
    },
    additionalParentId: isInUse ? nanoid() : undefined,
    newParentIsTopLevel,
  },
}))
