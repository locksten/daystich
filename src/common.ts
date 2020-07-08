import { format } from "date-fns"
import humanizeDuration from "humanize-duration"

export type Timestamp = number

export type Duration = number

export type Id = string

export type Color = string

export const formatTime = (t: number | Date) => format(t, "HH:mm")

export const shortHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  round: true,
  delimiter: " ",
  spacer: "",
  units: ["y", "mo", "d", "h", "m"],
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
})
