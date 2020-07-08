import { createAction, nanoid } from "@reduxjs/toolkit"
import { Activity } from "ducks/activity"
import { Tag } from "ducks/tag"
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
      activityTag: Omit<Tag, "id">
      isInUse: boolean
    },
    { activity: Activity; activityTag: Tag; newParentId?: Id }
  >
>("activity/addActivity", ({ activity, activityTag, isInUse }) => {
  const id = nanoid()
  return {
    payload: {
      activity: { ...activity, id },
      activityTag: { ...activityTag, id },
      newParentId: isInUse ? nanoid() : undefined,
    },
  }
})

export type ActivtyChangesType = {
  id: Id
  activity: Partial<Pick<Activity, "tagIds">>
  activityTag: Partial<Pick<Tag, "name" | "displayAtTopLevel" | "color">>
}

export const updateActivity = createAction<ActivtyChangesType>(
  "activity/updateActivity",
)

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

export const addTag = createAction<
  AppPrepareAction<
    { tag: Omit<Tag, "id">; isInUse: boolean },
    { tag: Tag; newParentId?: Id }
  >
>(`tag/addTag`, ({ tag, isInUse }) => ({
  payload: {
    tag: {
      ...tag,
      id: nanoid(),
    },
    newParentId: isInUse ? nanoid() : undefined,
  },
}))
