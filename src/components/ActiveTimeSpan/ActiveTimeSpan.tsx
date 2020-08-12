/** @jsx jsx */
import { jsx } from "@emotion/core"
import { getCurrentTimestamp, humanizeDuration } from "common/time"
import { useIntervalState } from "common/useIntervalState"
import { Card } from "components/Card"
import { TagList } from "components/TagList"
import { FC } from "react"
import {
  selectActivityById,
  selectActivityColor,
} from "redux/ducks/activity/selectors"
import { selectActiveTimespan } from "redux/ducks/timeSpan/selectors"
import { TimeSpan } from "redux/ducks/timeSpan/types"
import { useAppSelector } from "redux/redux/rootReducer"
import "twin.macro"
import { useAppDispatch } from "redux/redux/store"
import { updateTimeSpan } from "redux/ducks/timeSpan/timeSpan"

export const ActiveTimeSpan: FC<{}> = () => {
  const timeSpan = useAppSelector(selectActiveTimespan)
  return (
    <div tw="flex justify-center">
      {timeSpan && <ActiveTimeSpanExisting span={timeSpan} />}
    </div>
  )
}

const ActiveTimeSpanExisting: FC<{ span: TimeSpan }> = ({ span }) => {
  const dispatch = useAppDispatch()
  const activity = useAppSelector((s) =>
    selectActivityById(s, span.activityId),
  )!
  const color = useAppSelector((s) => selectActivityColor(s, activity.id))

  return (
    <div className="group" tw="max-w-2xl w-full">
      <Card
        tw="p-8 flex space-x-4 justify-between items-center text-white"
        css={{ backgroundColor: color }}
      >
        <div tw="flex space-x-4 items-center overflow-x-scroll">
          <div tw="font-semibold text-3xl">{activity.name}</div>
          <div tw="overflow-x-scroll">
            <TagList
              value={span.tagIds}
              onChange={(ids) =>
                dispatch(updateTimeSpan({ id: span.id, tagIds: ids }))
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
    humanizeDuration(getCurrentTimestamp() - span.startTime, {
      units: ["h", "m"],
      delimiter: " ",
      round: true,
    }),
  )
  return <div tw="font-light text-2xl whitespace-no-wrap">{time}</div>
}
