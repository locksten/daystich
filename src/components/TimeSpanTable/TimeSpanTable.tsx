/** @jsx jsx */
import { jsx } from "@emotion/core"
import { nanoid } from "@reduxjs/toolkit"
import { Card } from "Card"
import { formatISOTime, Id } from "common"
import { Input } from "components/Input"
import { PrimaryButton } from "components/PrimaryButton"
import { SecondaryButton } from "components/SecondaryButton"
import { Table } from "components/Table"
import { formatDistanceStrict } from "date-fns"
import { useAppSelector } from "ducks/redux/rootReducer"
import { selectTagById } from "ducks/tag"
import { addTestTimeSpans, addTimeSpan, selectTimespans } from "ducks/timeSpan"
import { FC, Fragment } from "react"
import { useForm } from "react-hook-form"
import "twin.macro"
import { useAppDispatch } from "ducks/redux/store"

type Inputs = {
  mainTagId: string
  tagIds: string
  startTime: string
}

const Tag: FC<{ id: Id }> = ({ id }) => {
  const tag = useAppSelector((s) => selectTagById(s, id))
  return <Fragment>:{tag?.name}</Fragment>
}

const Tags: FC<{ ids: Id[] }> = ({ ids }) => {
  return (
    <Fragment>
      {ids.map((id) => {
        return <Tag key={id} id={id} />
      })}
    </Fragment>
  )
}

export const TimeSpanTable: FC<{}> = () => {
  const timeSpans = useAppSelector(selectTimespans)
  const dispatch = useAppDispatch()

  const { register, handleSubmit, reset } = useForm<Inputs>()
  const onSubmit = ({ mainTagId, startTime, tagIds }: Inputs) => {
    dispatch(
      addTimeSpan({
        id: nanoid(),
        mainTagId,
        startTime: startTime === "" ? Date.now() : Number(startTime),
        tagIds: tagIds.split(","),
      }),
    )
    reset({ mainTagId, tagIds })
  }

  return (
    <Card tw="grid gap-2">
      <Table
        header={
          <tr>
            <th>Id</th>
            <th>mainTag</th>
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
              <Tag id={ts.mainTagId} />
            </td>
            <td>
              <Tags ids={ts.tagIds} />
            </td>
            <td>{formatISOTime(ts.startTime)}</td>
            <td>{ts.endTime && formatISOTime(ts.endTime)}</td>
            <td>
              {ts.endTime && formatDistanceStrict(ts.startTime, ts.endTime)}
            </td>
          </tr>
        ))}
      </Table>
      <form onSubmit={handleSubmit(onSubmit)} tw="grid grid-flow-col gap-2">
        <Input ref={register} name="mainTagId" label="mainTagId" />
        <Input ref={register} name="tagIds" label="tagIds" />
        <Input ref={register} name="startTime" label="startTime" />
        <PrimaryButton text="Add" type="submitButton" />
      </form>
      <SecondaryButton
        text="Add test data"
        onClick={() => dispatch(addTestTimeSpans(["mainTagId"]))}
      />
    </Card>
  )
}