/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import "twin.macro"
import { SecondaryButton } from "./SecondaryButton"

export default {
  title: "Components/Button/SecondaryButton",
  component: SecondaryButton,
} as Meta

const Template: Story<Parameters<typeof SecondaryButton>[0]> = (args) => (
  <SecondaryButton {...args} />
)

export const Normal = Template.bind({})
Normal.args = { label: "button" }

export const Danger = Template.bind({})
Danger.args = { label: "delete", kind: "danger" }
