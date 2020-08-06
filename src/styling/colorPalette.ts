import resolveConfig from "tailwindcss/resolveConfig"

const theme = resolveConfig().theme

const generatePalette = () => {
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
      return theme["colors"][hue][value] as string
    }),
  )
}

export const colorPalette = generatePalette()

export const defaultActivityTagColor = colorPalette[2]
