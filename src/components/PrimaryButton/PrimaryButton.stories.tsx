/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import "twin.macro"
import { PrimaryButton } from "./PrimaryButton"

export default {
  title: "Components/Button/PrimaryButton",
  component: PrimaryButton,
} as Meta

const Template: Story<Parameters<typeof PrimaryButton>[0]> = (args) => (
  <PrimaryButton {...args} />
)

export const Primary = Template.bind({})
Primary.args = { label: "label" }
