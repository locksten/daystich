/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import { selectActivityTreeList } from "redux/ducks/activity/selectors"
import { useReduxMocks } from "redux/mocking/mocks"
import { BorderDecorator } from "storybook/BorderDecorator"
import "twin.macro"
import { List } from "./List"
import { DarkBackgroundDecorator } from "storybook/DarkBackgroundDecorator"

export default {
  title: "Components/CardList/List",
  component: List,
  decorators: [BorderDecorator, DarkBackgroundDecorator],
} as Meta

const Template: Story<Parameters<typeof List>[0]> = (args) => {
  const { m, s } = useReduxMocks()
  const activity = m.activity({
    name: "Work",
    color: 19,
    children: [
      { name: "Work" },
      { name: "Commute" },
      { name: "Meetings" },
      { name: "Email", color: 16 },
    ],
  })
  const nodes = selectActivityTreeList(s(), activity)

  return (
    <List
      {...args}
      singleConfig={{
        onLeafClick: () => {},
        RenderSide: () => <div>side</div>,
      }}
      nodes={nodes}
    />
  )
}

export const Default = Template.bind({})
