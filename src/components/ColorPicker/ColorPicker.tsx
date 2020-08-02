/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { FC } from "react"
import { CirclePicker } from "react-color"
import "twin.macro"
import { twTheme, TwColorKey, TailwindColorConfig } from "styling/tailwindTheme"

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
        colors={palette}
      />
    </div>
  )
}

const generatePalette = () => {
  const hues: TwColorKey[] = [
    "gray",
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "indigo",
    "purple",
    "pink",
  ]
  const values: (keyof TailwindColorConfig)[] = [300, 500, 700]
  return hues.flatMap((hue, idx) =>
    (idx % 2 === 0 ? values : values.reverse()).map(
      (value) => twTheme.colors[hue][value],
    ),
  )
}

const palette = generatePalette()
