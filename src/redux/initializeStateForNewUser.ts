import { Id } from "common"
import { rootActivityId } from "redux/common"
import { selectActivities } from "redux/ducks/activity"
import { addActivity, addTag } from "redux/ducks/shared/actions"
import { addTimeSpanNow } from "redux/ducks/timeSpan"
import { AppStore } from "redux/redux/store"
import { colorPalette } from "styling/colorPalette"
import {
  selectIsNewUserFirstLoad,
  finishNewUserFirstLoad,
} from "redux/ducks/meta"
import { selectTags } from "redux/ducks/tag"

export const createInitialState = (store: AppStore) => {
  type MakeActivityArgs = {
    name: string
    parent?: Id
    tags?: Id[]
    color?: number
    children?: MakeActivityArgs[]
  }

  const makeActivity = ({
    name,
    parent = rootActivityId,
    tags = [],
    color,
    children,
  }: MakeActivityArgs) => {
    store.dispatch(
      addActivity({
        activity: { tagIds: tags },
        activityTag: {
          name,
          parentTagId: parent,
          color: color ? colorPalette[color] : undefined,
        },
        isInUse: false,
        newParentIsTopLevel: parent === rootActivityId,
      }),
    )

    const activities = selectActivities(store.getState())
    const id = activities[activities.length - 1].id
    if (children)
      children.forEach((child) => makeActivity({ ...child, parent: id }))
    return id
  }

  const makeTag = ({
    name,
    parent,
    color,
  }: {
    name: string
    parent?: Id
    color?: number
  }) => {
    store.dispatch(
      addTag({
        tag: {
          name,
          parentTagId: parent,
          color: color ? colorPalette[color] : undefined,
        },
        isInUse: false,
        newParentIsTopLevel: parent === undefined,
      }),
    )
    const tags = selectTags(store.getState())
    return tags[0].id
  }

  if (!selectIsNewUserFirstLoad(store.getState())) return
  store.dispatch(finishNewUserFirstLoad())

  const productivity = makeTag({ name: "Productivity", color: 19 })

  const spareTime = makeTag({ name: "Spare Time", color: 21 })

  makeActivity({
    name: "Work",
    color: 19,
    children: [
      { name: "Work", tags: [productivity] },
      { name: "Meetings" },
      { name: "Email" },
    ],
  })

  makeActivity({ name: "Misc", color: 22, tags: [spareTime] })

  makeActivity({ name: "Chores", color: 21, tags: [spareTime] })

  makeActivity({
    name: "Side Projects",
    color: 15,
    tags: [productivity],
    children: [],
  })

  makeActivity({
    name: "Free Time",
    color: 29,
    children: [
      {
        name: "Free Time",
      },
      {
        name: "Hobbies",
        tags: [spareTime],
      },
      {
        name: "Entertainment",
        children: [{ name: "TV" }, { name: "Reading" }, { name: "Games" }],
      },
    ],
  })

  makeActivity({
    name: "Health",
    color: 13,
    children: [{ name: "Exercise" }, { name: "Sleep" }],
  })

  const untracked = makeActivity({ name: "Untracked", color: 2 })

  store.dispatch(addTimeSpanNow({ activityId: untracked }))
}
