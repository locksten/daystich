/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import { selectActivityTreeList } from "redux/ducks/activity/selectors"
import { useReduxMocks } from "redux/mocking/mocks"
import { BorderDecorator } from "storybook/BorderDecorator"
import "twin.macro"
import { ListCard } from "./ListCard"

export default {
  title: "Components/CardList/ListCard",
  component: ListCard,
  decorators: [BorderDecorator],
} as Meta

const Template: Story<Parameters<typeof ListCard>[0]> = (args) => {
  const { m, s } = useReduxMocks()
  const activity = m.activity({
    name: "Work",
    children: [
      { name: "Work" },
      { name: "Commute" },
      { name: "Meetings" },
      { name: "Email" },
    ],
  })
  const node = selectActivityTreeList(s(), activity)[0]

  return (
    <ListCard
      {...args}
      singleConfig={{
        onLeafClick: () => {},
        RenderSide: () => <div>side</div>,
      }}
      node={node}
    />
  )
}

export const Default = Template.bind({})
Default.args = {}
