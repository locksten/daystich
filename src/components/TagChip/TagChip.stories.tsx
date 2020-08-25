/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import "twin.macro"
import { TagChip } from "./TagChip"
import { useReduxMocks } from "redux/mocking/mocks"

export default {
  title: "Components/Tag/TagChip",
  component: TagChip,
} as Meta

const Template: Story<Parameters<typeof TagChip>[0] & { name: string }> = ({
  name,
  ...args
}) => {
  const id = useReduxMocks().m.tag({ name: name })
  return <TagChip {...args} id={id} />
}

export const Default = Template.bind({})
Default.args = { name: "tag" }

export const Emoji = Template.bind({})
Emoji.args = { name: "🍰" }
