/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Card } from "Card"
import { formatDistanceToNowStrict } from "date-fns"
import { useAppSelector } from "ducks/redux/rootReducer"
import { selectTagById } from "ducks/tag"
import { selectActiveTimespan, TimeSpan } from "ducks/timeSpan"
import { FC, useEffect, useState } from "react"
import "twin.macro"

export const ActiveTimeSpan: FC<{}> = () => {
  const timeSpan = useAppSelector(selectActiveTimespan)
  return (
    <div tw="flex justify-center">
      {timeSpan ? (
        <ActiveTimeSpanExisting span={timeSpan} />
      ) : (
        <ActiveTimeSpanNotExisting />
      )}
    </div>
  )
}

export const ActiveTimeSpanNotExisting: FC<{}> = () => (
  <Card tw="max-w-xl w-full bg-green-400 text-white text-2xl font-semibold">
    Start tracking!
  </Card>
)

function useIntervalState<S>(fn: () => S, ms: number = 1000) {
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

export const ActiveTimeSpanExisting: FC<{ span: TimeSpan }> = ({ span }) => {
  const mainTag = useAppSelector((s) => selectTagById(s, span.mainTagId))

  return (
    <Card tw="max-w-xl w-full px-8 py-8 flex justify-between items-center bg-green-400 text-white">
      <div tw="font-semibold text-3xl">{mainTag?.name}</div>
      <ActiveTimeSpanTime span={span} />
    </Card>
  )
}

const ActiveTimeSpanTime: FC<{ span: TimeSpan }> = ({ span }) => {
  const time = useIntervalState(() =>
    formatDistanceToNowStrict(span.startTime, { unit: "second" }),
  )
  return <div tw="font-light text-2xl">{time}</div>
}
