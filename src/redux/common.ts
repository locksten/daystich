import { Id } from "common"
import { Activity } from "redux/ducks/activity"
import { Tag } from "redux/ducks/tag"
import { defaultActivityTagColor } from "styling/colorPalette"

export const rootActivityId = "rootActivityId-xiftrK"

export const isRootActivityId = (id?: Id) => id === "rootActivityId-xiftrK"

export const isRootActivity = ({ id }: { id?: Id }) =>
  id === "rootActivityId-xiftrK"

export const rootActivityTag: Tag = {
  id: rootActivityId,
  name: "Activity",
  color: defaultActivityTagColor,
  ordering: 0,
}

export const rootActivity: Activity = {
  id: rootActivityId,
  tagIds: [],
}
