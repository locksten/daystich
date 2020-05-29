import resolveConfig from "tailwindcss/resolveConfig"
import tailwindConfig from "styling/tailwind.config"

export type tailwindColorConfig = {
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

export type tailwindSpacingConfig = {
  "0": string
  "1": string
  "2": string
  "3": string
  "4": string
  "5": string
  "6": string
  "8": string
  "10": string
  "12": string
  "16": string
  "20": string
  "24": string
  "32": string
  "40": string
  "48": string
  "56": string
  "64": string
}

export const {
  theme: twTheme,
}: {
  theme: {
    colors: {
      black: string
      white: string
      gray: tailwindColorConfig
      red: tailwindColorConfig
      orange: tailwindColorConfig
      yellow: tailwindColorConfig
      green: tailwindColorConfig
      teal: tailwindColorConfig
      blue: tailwindColorConfig
      indigo: tailwindColorConfig
      purple: tailwindColorConfig
      pink: tailwindColorConfig
    }
    spacing: tailwindSpacingConfig
  }
} = resolveConfig(tailwindConfig)
