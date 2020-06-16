/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { Modal, useModal } from "components/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { TextField } from "components/TextField"
import { useAppDispatch } from "ducks/redux/store"
import { addTag } from "ducks/tag"
import { FC } from "react"
import { useForm } from "react-hook-form"
import "twin.macro"

type Inputs = {
  name: string
  color: Color
}

const AddTagModal: FC<{ id?: Id }> = ({ id }) => {
  const dispatch = useAppDispatch()

  const { register, handleSubmit } = useForm<Inputs>()
  const onSubmit = ({ name, color }: Inputs) => {
    dispatch(addTag({ name, parentTagId: id, color }))
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      tw="grid gap-2 w-full rounded-md-4 p-4 bg-white shadow-lg"
    >
      <TextField ref={register} name="name" label="Name" />
      <TextField ref={register} name="color" label="Color" />
      <div tw="grid grid-flow-col gap-2">
        <PrimaryButton text="Add" type="submitButton" />
      </div>
    </form>
  )
}

export const useAddTagModal = (id?: Id) => {
  return useModal((props) => (
    <Modal aria-label="Add tag" tw="max-w-xs" {...props}>
      <AddTagModal id={id} />
    </Modal>
  ))
}
