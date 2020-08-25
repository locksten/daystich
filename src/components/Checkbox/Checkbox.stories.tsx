/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import "twin.macro"
import { Checkbox } from "./Checkbox"

export default {
  title: "Components/Form/Checkbox",
  component: Checkbox,
} as Meta

const Template: Story<Parameters<typeof Checkbox>[0]> = (args) => (
  <Checkbox {...args} />
)

export const Checked = Template.bind({})
Checked.args = { label: "Checked", defaultChecked: true }

export const Unchecked = Template.bind({})
Unchecked.args = { label: "Unchecked", defaultChecked: false }
