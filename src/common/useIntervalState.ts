import { useState, useEffect } from "react"

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
