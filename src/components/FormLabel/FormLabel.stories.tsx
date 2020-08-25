/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import "twin.macro"
import { FormLabel } from "./FormLabel"

export default {
  title: "Components/Form/FormLabel",
  component: FormLabel,
} as Meta

const Template: Story<Parameters<typeof FormLabel>[0]> = (args) => (
  <FormLabel {...args} />
)

export const Default = Template.bind({})
Default.args = {
  label: "label",
  children: <div tw="bg-gray-300 px-2 py-1 rounded-md">form element</div>,
}
