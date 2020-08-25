/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import "twin.macro"
import { Card } from "./Card"

export default {
  title: "Components/Misc/Card",
  component: Card,
} as Meta

const Template: Story<Parameters<typeof Card>[0]> = (args) => (
  <Card {...args}>
    <div tw="bg-gray-200 rounded-md p-4">Card</div>
  </Card>
)

export const Default = Template.bind({})
Default.args = {}
