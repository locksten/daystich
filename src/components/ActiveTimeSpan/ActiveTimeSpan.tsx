/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Card } from "components/Card"
import { TagList } from "components/TagList"
import { formatDistanceToNowStrict } from "date-fns"
import { useAppSelector } from "ducks/redux/rootReducer"
import { useAppDispatch } from "ducks/redux/store"
import { selectTagById, selectTagColor } from "ducks/tag"
import { selectActiveTimespan, TimeSpan, updateTimespan } from "ducks/timeSpan"
import { FC } from "react"
import "twin.macro"
import { useIntervalState } from "hooks/useIntervalState"

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

export const ActiveTimeSpanExisting: FC<{ span: TimeSpan }> = ({ span }) => {
  const activityTag = useAppSelector((s) => selectTagById(s, span.activityId))!
  const color = useAppSelector((s) => selectTagColor(s, activityTag.id))
  const dispatch = useAppDispatch()

  return (
    <div className="group" tw="max-w-2xl w-full">
      <Card
        tw="p-8 flex space-x-4 justify-between items-center text-white"
        css={{ backgroundColor: color }}
      >
        <div tw="flex space-x-4 items-center overflow-x-scroll">
          <div tw="font-semibold text-3xl">{activityTag.name}</div>
          <div tw="overflow-x-scroll">
            <TagList
              value={span.tagIds}
              onChange={(ids) =>
                dispatch(updateTimespan({ id: span.id, tagIds: ids }))
              }
              showAddButton="onGroupHover"
              wrap={false}
            />
          </div>
        </div>
        <ActiveTimeSpanTime span={span} />
      </Card>
    </div>
  )
}

const ActiveTimeSpanTime: FC<{ span: TimeSpan }> = ({ span }) => {
  const time = useIntervalState(() =>
    formatDistanceToNowStrict(span.startTime, { unit: "second" }),
  )
  return <div tw="font-light text-2xl whitespace-no-wrap">{time}</div>
}
