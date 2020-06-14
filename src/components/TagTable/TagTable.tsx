/** @jsx jsx */
import { jsx } from "@emotion/core"
import { nanoid } from "@reduxjs/toolkit"
import { Card } from "Card"
import { Id } from "common"
import { Input } from "components/Input"
import { PrimaryButton } from "components/PrimaryButton"
import { Table } from "components/Table"
import { useAppSelector } from "ducks/redux/rootReducer"
import { useAppDispatch } from "ducks/redux/store"
import { addTag, selectTags } from "ducks/tag"
import { FC } from "react"
import { useForm } from "react-hook-form"
import "twin.macro"

type Inputs = {
  name: string
  parentTagId: Id
}

export const TagTable: FC<{}> = () => {
  const tags = useAppSelector(selectTags)
  const dispatch = useAppDispatch()

  const { register, handleSubmit, reset } = useForm<Inputs>()
  const onSubmit = ({ name, parentTagId }: Inputs) => {
    dispatch(addTag({ id: nanoid(), name, parentTagId }))
    reset({ parentTagId })
  }

  return (
    <Card tw="grid gap-2">
      <Table
        header={
          <tr>
            <th>Id</th>
            <th>parentTag</th>
            <th>name</th>
          </tr>
        }
      >
        {tags.map((t) => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{tags.find((tag) => tag.id === t.parentTagId)?.name}</td>
            <td>{t.name}</td>
          </tr>
        ))}
      </Table>
      <form onSubmit={handleSubmit(onSubmit)} tw="grid grid-flow-col gap-2">
        <Input ref={register} name="name" label="name" />
        <Input ref={register} name="parentTagId" label="parentTagId" />
        <PrimaryButton text="Add" type="submitButton" />
      </form>
    </Card>
  )
}
