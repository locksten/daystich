/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import "twin.macro"
import { TagCardList } from "./TagCardList"
import { useReduxMocks } from "redux/mocking/mocks"

export default {
  title: "Components/CardList/TagCardList",
  component: TagCardList,
} as Meta

const Template: Story<Parameters<typeof TagCardList>[0]> = (args) => {
  useReduxMocks({ loadDemo: true })
  return <TagCardList {...args} />
}

export const Default = Template.bind({})
Default.args = {}
