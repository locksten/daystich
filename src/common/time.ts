import { Flavor } from "common/utilityTypes"
import { format } from "date-fns"
import HumanizeDuration from "humanize-duration"

export type Duration = Flavor<number, "Duration">

export type Timestamp = Flavor<number, "Timestamp">

export const getCurrentTimestamp = Date.now as () => Timestamp

export const formatTime = (t: Timestamp) => format(t, "HH:mm")

export const humanizeDuration: (
  duration: Duration,
  options?: HumanizeDuration.Options,
) => string = HumanizeDuration

export const shortHumanizer = HumanizeDuration.humanizer({
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
