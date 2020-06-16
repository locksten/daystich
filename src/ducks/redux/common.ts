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
    },
    { activity: Activity; activityTag: Tag }
  >
>("activity/addActivity", ({ activity, activityTag }) => {
  const id = nanoid()
  return {
    payload: {
      activity: { ...activity, id },
      activityTag: { ...activityTag, id },
    },
  }
})

export type ActivtyChangesType = {
  id: Id
  activity: Partial<Pick<Activity, "displayAtTopLevel" | "tagIds">>
  activityTag: Partial<Pick<Tag, "name" | "color">>
}

export const updateActivity = createAction<ActivtyChangesType>(
  "activity/updateActivity",
)

export const removeActivity = createAction<Pick<Activity, "id">>(
  "activity/removeActivity",
)

export const defaultTagColor = "#4A5568"

export const rootActivityId = "rootActivityId-xiftrK"

export const rootActivityTag: Tag = {
  id: rootActivityId,
  name: "Activity",
  color: "#4A5568",
}

export const rootActivity: Activity = {
  id: rootActivityId,
  tagIds: [],
  displayAtTopLevel: false,
}
