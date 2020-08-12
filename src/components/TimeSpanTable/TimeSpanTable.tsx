/** @jsx jsx */
import { jsx } from "@emotion/core"
import { formatTime, shortHumanizer } from "common/time"
import { Card } from "components/Card"
import { PrimaryButton } from "components/PrimaryButton"
import { Table } from "components/Table"
import { TextField } from "components/TextField"
import { FC, Fragment } from "react"
import { useForm } from "react-hook-form"
import { selectActivityById } from "redux/ducks/activity/selectors"
import { ActivityId } from "redux/ducks/activity/types"
import { selectTagById } from "redux/ducks/tag/selectors"
import { TagId } from "redux/ducks/tag/types"
import { selectTimespans } from "redux/ducks/timeSpan/selectors"
import { addTimeSpan } from "redux/ducks/timeSpan/timeSpan"
import { useAppSelector } from "redux/redux/rootReducer"
import { useAppDispatch } from "redux/redux/store"
import "twin.macro"

type Inputs = {
  activityId: string
  tagIds: string
  startTime: string
}

const Activity: FC<{ id: ActivityId }> = ({ id }) => {
  const activity = useAppSelector((s) => selectActivityById(s, id))
  return <Fragment>{activity?.name}</Fragment>
}

const Tags: FC<{ ids?: TagId[] }> = ({ ids = [] }) => {
  const Tag: FC<{ id: TagId }> = ({ id }) => {
    const tag = useAppSelector((s) => selectTagById(s, id))
    return <Fragment>:{tag?.name}</Fragment>
  }
  return (
    <Fragment>
      {ids.map((id) => {
        return <Tag key={id} id={id} />
      })}
    </Fragment>
  )
}

export const TimeSpanTable: FC<{}> = () => {
  const dispatch = useAppDispatch()
  const timeSpans = useAppSelector(selectTimespans)

  const { register, handleSubmit, reset } = useForm<Inputs>()
  const onSubmit = ({ activityId, startTime, tagIds }: Inputs) => {
    dispatch(
      addTimeSpan({
        activityId: activityId as ActivityId,
        startTime: startTime === "" ? Date.now() : Number(startTime),
      }),
    )

    reset({ activityId, tagIds })
  }

  return (
    <Card tw="grid gap-2">
      <Table
        header={
          <tr>
            <th>Id</th>
            <th>activity</th>
            <th>tags</th>
            <th>startTime</th>
            <th>endTime</th>
            <th>duration</th>
          </tr>
        }
      >
        {timeSpans.map((ts) => (
          <tr key={ts.id}>
            <td>{ts.id.slice(18)}</td>
            <td>
              <Activity id={ts.activityId} />
            </td>
            <td>
              <Tags ids={ts.tagIds} />
            </td>
            <td>{formatTime(ts.startTime)}</td>
            <td>{ts.endTime && formatTime(ts.endTime)}</td>
            <td>{ts.endTime && shortHumanizer(ts.endTime - ts.startTime)}</td>
          </tr>
        ))}
      </Table>
      <form onSubmit={handleSubmit(onSubmit)} tw="grid grid-flow-col gap-2">
        <TextField ref={register} name="activityId" label="activityId" />
        <TextField ref={register} name="tagIds" label="tagIds" />
        <TextField ref={register} name="startTime" label="startTime" />
        <PrimaryButton text="Add" type="submitButton" />
      </form>
    </Card>
  )
}
