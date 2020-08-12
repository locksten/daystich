import { nanoid } from "@reduxjs/toolkit"
import { Duration, Timestamp } from "common/time"
import { Brand } from "common/utilityTypes"
import { ActivityId } from "redux/ducks/activity/types"
import { TagId } from "redux/ducks/tag/types"

export type TimeSpanId = Brand<string, "TimeSpan">

export const generateTimeSpanId = (nanoid as unknown) as () => TimeSpanId

export type TimeSpan = {
  _type: "timeSpan"
  id: TimeSpanId
  activityId: ActivityId
  tagIds?: TagId[]
  startTime: Timestamp
  endTime: Timestamp
  /* duration must be defined if endTime is defined */
  duration: Duration
}
