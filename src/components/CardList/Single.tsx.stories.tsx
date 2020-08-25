/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import { selectActivityById } from "redux/ducks/activity/selectors"
import { useReduxMocks } from "redux/mocking/mocks"
import { BorderDecorator } from "storybook/BorderDecorator"
import { DarkBackgroundDecorator } from "storybook/DarkBackgroundDecorator"
import "twin.macro"
import { Single } from "./Single"

export default {
  title: "Components/CardList/Single",
  component: Single,
  decorators: [BorderDecorator, DarkBackgroundDecorator],
} as Meta

const Template: Story<Parameters<typeof Single>[0]> = (args) => {
  const { m, s } = useReduxMocks()
  const id = m.activity({ name: "Activity" })
  const activity = selectActivityById(s(), id)!
  return (
    <Single
      {...args}
      singleConfig={{
        onLeafClick: () => {},
        RenderSide: () => <div>side</div>,
      }}
      node={{ entity: activity, children: [], hasChildren: false }}
      isTopLevel={true}
    />
  )
}

export const Default = Template.bind({})
Default.args = {}
