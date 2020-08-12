import resolveConfig from "tailwindcss/resolveConfig"
import { Brand } from "common/utilityTypes"

export type Color = Brand<string, "Color">

const generatePalette = () => {
  const theme = resolveConfig().theme

  const hues = [
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
  const values = ["300", "500", "700"]
  return hues.flatMap((hue, idx) =>
    (idx % 2 === 0 ? values : values.reverse()).map((value) => {
      return theme["colors"][hue][value] as Color
    }),
  )
}

export const colorPalette = generatePalette()

export const defaultActivityColor = colorPalette[2]
export const defaultTagColor = colorPalette[2]
