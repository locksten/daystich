/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { Checkbox } from "components/Checkbox"
import { Modal, useModal } from "components/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { SecondaryButton } from "components/SecondaryButton"
import { TextField } from "components/TextField"
import { useAppDispatch } from "ducks/redux/store"
import { removeTag } from "ducks/tag"
import { FC } from "react"
import { useForm } from "react-hook-form"
import "twin.macro"

type Inputs = {
  name: string
  color: Color
}

const EditTagModal: FC<{ tagId: Id }> = ({ tagId }) => {
  const dispatch = useAppDispatch()

  const { register, handleSubmit } = useForm<Inputs>()
  const onSubmit = ({ name, color }: Inputs) => {
    // dispatch(addTag({ id: nanoid(), name, parentTagId, color }))
    console.log(name, color)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      tw="grid gap-2 w-full rounded-md-4 p-4 bg-white shadow-lg"
    >
      <TextField ref={register} name="name" label="Name" />
      <TextField ref={register} name="color" label="Color" />
      <Checkbox
        ref={register}
        name="displayAtTopLevel"
        label="Display at top level"
      />
      <div tw="grid grid-flow-col gap-2">
        <PrimaryButton text="Save" type="submitButton" />
        <SecondaryButton
          tw="text-red-600"
          text="Delete"
          onClick={() => dispatch(removeTag({ id: tagId }))}
        />
      </div>
    </form>
  )
}

export const useEditTagModal = (tagId: Id) => {
  return useModal((props) => (
    <Modal aria-label="Add tag" tw="max-w-xs" {...props}>
      <EditTagModal tagId={tagId} />
    </Modal>
  ))
}
