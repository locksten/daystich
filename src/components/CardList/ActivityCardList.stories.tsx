/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import { moveActivity } from "redux/ducks/activity/activity"
import { useReduxMocks } from "redux/mocking/mocks"
import "twin.macro"
import { ActivityCardList } from "./ActivityCardList"

export default {
  title: "Components/CardList/ActivityCardList",
  component: ActivityCardList,
} as Meta

const Template: Story = (args) => {
  const { m } = useReduxMocks()

  m.activity({
    name: "Work",
    color: 19,
    children: [{ name: "Work" }, { name: "Meetings" }, { name: "Email" }],
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

  return <ActivityCardList {...args} />
}

export const Default = Template.bind({})
Default.args = {}

export const TopLevelActivity = () => {
  const { m, D } = useReduxMocks()

  const parent = m.activity({
    name: "parent",
    children: [{ name: "non top level child" }],
  })
  const child = m.activity({ name: "top level child", parent, color: 12 })
  D(moveActivity({ id: child, to: { topLevelOrdering: 0 } }))

  return <ActivityCardList />
}
