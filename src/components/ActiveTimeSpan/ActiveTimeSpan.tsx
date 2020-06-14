/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Card } from "Card"
import { formatDistanceToNow } from "date-fns"
import { useAppSelector } from "ducks/redux/rootReducer"
import { selectTagById } from "ducks/tag"
import { selectActiveTimespan, TimeSpan } from "ducks/timeSpan"
import { FC } from "react"
import "twin.macro"

export const ActiveTimeSpan: FC<{}> = () => {
  const timeSpan = useAppSelector(selectActiveTimespan)
  return (
    <div tw="flex justify-center">
      {timeSpan ? (
        <ActiveTimeSpanExisting timeSpan={timeSpan} />
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

export const ActiveTimeSpanExisting: FC<{ timeSpan: TimeSpan }> = ({
  timeSpan: span,
}) => {
  const mainTag = useAppSelector((s) => selectTagById(s, span.mainTagId))
  return (
    <Card tw="max-w-xl w-full px-8 py-8 flex justify-between items-center bg-green-400 text-white">
      <div tw="font-semibold text-3xl">{mainTag?.name}</div>
      <div tw="font-light text-2xl">{formatDistanceToNow(span.startTime)}</div>
    </Card>
  )
}
