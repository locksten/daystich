/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { FC } from "react"
import { CirclePicker } from "react-color"
import "twin.macro"
import { colorPalette } from "styling/colorPalette"

export const ColorPicker: FC<{
  value?: string
  onChange?: (color: string) => void
}> = ({ value, onChange }) => {
  const spacing = 6

  return (
    <div
      css={css`
        margin-left: ${spacing}px;
      `}
    >
      <CirclePicker
        tw="flex justify-center"
        circleSpacing={spacing}
        circleSize={30}
        width={"100%"}
        color={value}
        onChangeComplete={(color) => {
          onChange?.(color.hex)
        }}
        colors={colorPalette}
      />
    </div>
  )
}
