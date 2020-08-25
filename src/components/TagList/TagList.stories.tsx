/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import "twin.macro"
import { TagList } from "./TagList"
import { useReduxMocks } from "redux/mocking/mocks"
import { MockTagArgs } from "redux/mocking/makeMocks"
import { FittedBorderDecorator } from "storybook/FittedBorderDecorator"

export default {
  title: "Components/Tag/TagList",
  component: TagList,
  decorators: [FittedBorderDecorator],
} as Meta

const Template: Story<
  Parameters<typeof TagList>[0] & { mockTags?: MockTagArgs[] }
> = ({ mockTags = [], ...args }) => {
  const { m } = useReduxMocks()
  return (
    <div className="group">
      <TagList {...args} value={mockTags.map((args) => m.tag(args))} />
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  mockTags: [
    { name: "important", color: 18 },
    { name: "rest", color: 22 },
    { name: "chores", color: 16 },
    { name: "health", color: 17 },
    { name: "free time", color: 8 },
  ],
}

export const Wrapping = () => (
  <div tw="w-64">
    <Default {...Default.args} />
  </div>
)

export const Scrolling = () => (
  <div tw="w-64 overflow-scroll">
    <Default {...Default.args} wrap={false} />
  </div>
)

export const ShowAddButtonOnGroupHover = () => (
  <Default {...Default.args} wrap={false} showAddButton={"onGroupHover"} />
)
