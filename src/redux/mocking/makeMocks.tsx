import { Timestamp } from "common/time"
import { addActivity } from "redux/ducks/activity/activity"
import { ActivityId } from "redux/ducks/activity/types"
import { addTag } from "redux/ducks/tag/tag"
import { TagId } from "redux/ducks/tag/types"
import { addTimeSpan } from "redux/ducks/timeSpan/timeSpan"
import { AppStore } from "redux/redux/store"
import { colorPalette } from "styling/color"
import { MockStore } from "./mocks"

export const makeMocks = (store: AppStore | MockStore) => ({
  activity: makeActivity(store),
  tag: makeTag(store),
  timeSpan: makeTimeSpan(store),
})

export type MockActivityArgs = {
  name: string
  parent?: ActivityId
  tags?: TagId[]
  color?: number
  children?: MockActivityArgs[]
}

const makeActivity = (store: MockStore | AppStore) => ({
  name,
  parent = undefined,
  tags = [],
  color,
  children,
}: MockActivityArgs) => {
  const { id } = store.dispatch(
    addActivity({
      name,
      parentId: parent,
      color: color ? colorPalette[color] : undefined,
      tagIds: tags,
    }),
  )

  if (children)
    children.forEach((child) =>
      makeActivity(store)({
        ...child,
        parent: id as ActivityId,
      }),
    )

  return id
}

export type MockTagArgs = {
  name: string
  parent?: TagId
  color?: number
  children?: MockTagArgs[]
}

const makeTag = (store: MockStore | AppStore) => ({
  name,
  parent = undefined,
  color,
  children,
}: MockTagArgs) => {
  const { id } = store.dispatch(
    addTag({
      name,
      parentId: parent,
      color: color ? colorPalette[color] : undefined,
    }),
  )

  if (children)
    children.forEach((child) =>
      makeTag(store)({
        ...child,
        parent: id as TagId,
      }),
    )

  return id
}

export type MockTimeSpanArgs = {
  activity: ActivityId
  startTime: Timestamp
}

const makeTimeSpan = (store: MockStore | AppStore) => ({
  activity,
  startTime,
}: MockTimeSpanArgs) => {
  const { id } = store.dispatch(
    addTimeSpan({ activityId: activity, startTime }),
  )
  return id
}
