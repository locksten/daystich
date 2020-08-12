import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import { Timestamp } from "common/time"
import { addActivity } from "redux/ducks/activity/activity"
import { ActivityId } from "redux/ducks/activity/types"
import { addTag } from "redux/ducks/tag/tag"
import { TagId } from "redux/ducks/tag/types"
import { addTimeSpan } from "redux/ducks/timeSpan/timeSpan"
import rootReducer from "redux/redux/rootReducer"
import { AppStore } from "redux/redux/store"
import { colorPalette } from "styling/color"

export const getEmptyMockStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware(),
  })
}

export type MockStore = ReturnType<typeof getEmptyMockStore>

export const getMockStore = () => {
  const store = getEmptyMockStore()
  return { ...store, s: store.getState, d: store.dispatch }
}

const makeMocks = (store: AppStore | MockStore) => ({
  activity: makeActivity(store),
  tag: makeTag(store),
  timeSpan: makeTimeSpan(store),
})

export const getReduxMocks = (store?: AppStore) => {
  if (store === undefined) {
    const store = getMockStore()
    return { m: makeMocks(store), store, D: store.d, s: store.s }
  } else {
    return { m: makeMocks(store), store, D: store.dispatch, s: store.getState }
  }
}

type MakeActivityArgs = {
  name: string
  parent?: ActivityId
  tags?: TagId[]
  color?: number
  children?: MakeActivityArgs[]
}

const makeActivity = (store: MockStore | AppStore) => ({
  name,
  parent = undefined,
  tags = [],
  color,
  children,
}: MakeActivityArgs) => {
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

type MakeTagArgs = {
  name: string
  parent?: TagId
  color?: number
  children?: MakeTagArgs[]
}

const makeTag = (store: MockStore | AppStore) => ({
  name,
  parent = undefined,
  color,
  children,
}: MakeTagArgs) => {
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

const makeTimeSpan = (store: MockStore | AppStore) => ({
  activity,
  startTime,
}: {
  activity: ActivityId
  startTime: Timestamp
}) => {
  const { id } = store.dispatch(
    addTimeSpan({ activityId: activity, startTime }),
  )
  return id
}
