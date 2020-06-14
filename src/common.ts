import { format } from "date-fns"
import { useState, useEffect } from "react"

export type Timestamp = number

export type Duration = number

export type Id = string

export type Color = string

export const formatISOTime = (t: number | Date) => format(t, "HH:mm:ss")

export const neg1ToUndefined = (n: number) => (n === -1 ? undefined : n)

export const mapUndef = <T, R>(
  arg: T | undefined,
  func: (_: T) => R,
): R | undefined => (arg === undefined ? undefined : func(arg))

export const isNumeric = (n: string) => !isNaN(Number(n))

export const useIntervalState = <S>(fn: () => S, ms: number = 1000) => {
  const [state, setState] = useState(fn)
  useEffect(() => {
    setState(fn)
    const interval = setInterval(() => setState(fn), ms)
    return () => {
      clearInterval(interval)
    }
  }, [fn, ms])
  return state
}
