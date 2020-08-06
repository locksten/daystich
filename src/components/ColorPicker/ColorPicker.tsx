/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { RHFControlledElementWrapper } from "common/RHFElementWrapper"
import { FC } from "react"
import { CirclePicker } from "react-color"
import { colorPalette } from "styling/colorPalette"
import "twin.macro"

export const ColorPicker: FC<{
  value?: string
  onChange?: (color?: string) => void
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
        onChangeComplete={({ hex }) => {
          onChange?.(hex === value ? undefined : hex)
        }}
        colors={colorPalette}
      />
    </div>
  )
}

export const RHFColorPicker = RHFControlledElementWrapper({
  Element: ColorPicker,
  defaultValue: undefined,
})
