/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Story } from "@storybook/react/types-6-0"
import "twin.macro"

export const DarkBackgroundDecorator = (Story: Story) => (
  <div tw="p-4 bg-gray-800">
    <Story />
  </div>
)
