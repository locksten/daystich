import { nanoid } from "@reduxjs/toolkit"
import { Brand } from "common/utilityTypes"
import { TagId } from "redux/ducks/tag/types"
import { Color } from "styling/color"

export type ActivityId = Brand<string, "ActivityId">

export const generateActivityId = nanoid as () => ActivityId

export type Activity = {
  _type: "activity"
  id: ActivityId
  parentId?: ActivityId
  name: string
  color?: Color
  tagIds?: TagId[]
  ordering?: number
  topLevelOrdering?: number
}

export const isActivity = (activity?: any): activity is Activity =>
  !!activity && "_type" in activity && activity._type === "activity"
