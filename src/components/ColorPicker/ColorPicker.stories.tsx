/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import { useFormWithContext } from "common/useFormWithContext"
import { Color } from "react-color"
import "twin.macro"
import { ColorPicker, RHFColorPicker } from "./ColorPicker"

export default {
  title: "Components/Form/ColorPicker",
  component: ColorPicker,
} as Meta

const Template: Story<Parameters<typeof ColorPicker>[0]> = () => {
  const { Form } = useFormWithContext<{ color?: Color }>(() => {})
  return (
    <Form tw="w-64">
      <RHFColorPicker name="color" />
    </Form>
  )
}

export const Default = Template.bind({})
Default.args = {}
