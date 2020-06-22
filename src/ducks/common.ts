import { Id } from "common"
import { Activity } from "ducks/activity"
import { Tag } from "ducks/tag"

export const defaultTagColor = "#4A5568"

export const rootActivityId = "rootActivityId-xiftrK"

export const isRootActivityId = (id?: Id) => id === "rootActivityId-xiftrK"

export const isRootActivity = ({ id }: { id?: Id }) =>
  id === "rootActivityId-xiftrK"

export const rootActivityTag: Tag = {
  id: rootActivityId,
  name: "Activity",
  color: "#4A5568",
  displayAtTopLevel: false,
}

export const rootActivity: Activity = {
  id: rootActivityId,
  tagIds: [],
}
