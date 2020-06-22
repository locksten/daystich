import { format } from "date-fns"

export type Timestamp = number

export type Duration = number

export type Id = string

export type Color = string

export const formatISOTime = (t: number | Date) => format(t, "HH:mm:ss")
