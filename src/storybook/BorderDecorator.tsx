/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Story } from "@storybook/react/types-6-0"
import "twin.macro"

export const BorderDecorator = (Story: Story) => (
  <div tw="border border-dashed border-gray-500 border-opacity-50">
    <Story />
  </div>
)
