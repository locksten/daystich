/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { Modal, useModal } from "components/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { SecondaryButton } from "components/SecondaryButton"
import { TextField } from "components/TextField"
import { useAppSelector } from "ducks/redux/rootReducer"
import { useAppDispatch } from "ducks/redux/store"
import { removeTag, selectTagById, updateTag } from "ducks/tag"
import { FC } from "react"
import { useForm } from "react-hook-form"
import "twin.macro"

export type Inputs = {
  name: string
  color: Color
}

const EditTagModal: FC<{ id: Id }> = ({ id }) => {
  const dispatch = useAppDispatch()

  const tag = useAppSelector((s) => selectTagById(s, id))

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      name: tag?.name,
      color: tag?.color,
    },
  })

  const onSubmit = (inputs: Inputs) => {
    dispatch(updateTag({ ...inputs, id }))
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      tw="grid gap-2 w-full rounded-md-4 p-4 bg-white shadow-lg"
    >
      <TextField ref={register} name="name" label="Name" />
      <TextField ref={register} name="color" label="Color" />
      <SecondaryButton
        tw="text-red-600"
        text="Delete"
        onClick={() => dispatch(removeTag({ id }))}
      />
      <PrimaryButton text="Save" type="submitButton" />
    </form>
  )
}

export const useEditTagModal = (id: Id) => {
  return useModal((props) => (
    <Modal aria-label="Edit tag" tw="max-w-xs" {...props}>
      <EditTagModal id={id} />
    </Modal>
  ))
}
