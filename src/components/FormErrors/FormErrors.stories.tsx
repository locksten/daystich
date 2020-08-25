/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import "twin.macro"
import { FormErrors } from "./FormErrors"

export default {
  title: "Components/Form/FormErrors",
  component: FormErrors,
} as Meta

const Template: Story<Parameters<typeof FormErrors>[0]> = (args) => (
  <FormErrors {...args} />
)

export const Single = Template.bind({})
Single.args = { errors: [{ message: "Name is required" }] }

export const Multiple = Template.bind({})
Multiple.args = {
  errors: [
    { message: "Email is reqired" },
    { message: "Name is required" },
    { message: "Password must be at least 20 characters long" },
  ],
}
