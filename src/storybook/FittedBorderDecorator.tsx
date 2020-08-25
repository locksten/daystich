/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import { Story } from "@storybook/react/types-6-0"
import "twin.macro"

export const FittedBorderDecorator = (Story: Story) => (
  <div
    tw="border border-dashed border-gray-400"
    css={css`
      width: fit-content;
    `}
  >
    <Story />
  </div>
)
