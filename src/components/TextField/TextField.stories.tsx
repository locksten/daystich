/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import "twin.macro"
import { TextField } from "./TextField"

export default {
  title: "Components/Form/TextField",
  component: TextField,
} as Meta

const Template: Story<Parameters<typeof TextField>[0]> = (args) => (
  <TextField {...args} />
)

export const Default = Template.bind({})
Default.args = { label: "label", placeholder: "placeholder" }
