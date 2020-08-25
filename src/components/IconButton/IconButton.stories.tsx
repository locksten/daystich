/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import "twin.macro"
import { IconButton } from "./IconButton"

export default {
  title: "Components/Button/IconButton",
  component: IconButton,
} as Meta

const Template: Story<Parameters<typeof IconButton>[0]> = (args) => (
  <IconButton {...args} />
)

export const Default = Template.bind({})
Default.args = { icon: "add" }

export const CircleBackground = Template.bind({})
CircleBackground.args = { icon: "add", background: "circle" }
