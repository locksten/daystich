import { AppStore } from "redux/redux/store"
import { getReduxMocks } from "redux/mocking/mocks"

export const addDemoState = (store: AppStore) => {
  const { m } = getReduxMocks(store)

  const productivity = m.tag({ name: "Productivity", color: 19 })
  const spareTime = m.tag({ name: "Spare Time", color: 21 })
  m.activity({
    name: "Work",
    color: 19,
    children: [
      { name: "Work", tags: [productivity] },
      { name: "Meetings" },
      { name: "Email" },
    ],
  })
  m.activity({ name: "Misc", color: 22, tags: [spareTime] })
  m.activity({ name: "Chores", color: 21, tags: [spareTime] })
  m.activity({
    name: "Side Projects",
    color: 15,
    tags: [productivity],
    children: [],
  })
  m.activity({
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
  m.activity({
    name: "Health",
    color: 13,
    children: [{ name: "Exercise" }, { name: "Sleep" }],
  })
}
