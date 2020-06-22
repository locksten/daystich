/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { Checkbox } from "components/Checkbox"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { TextField } from "components/TextField"
import { useAppDispatch } from "ducks/redux/store"
import { addTag } from "ducks/tag"
import { useForm } from "react-hook-form"
import "twin.macro"
import { FormModal } from "components/modals/FormModal"

type Inputs = {
  name: string
  displayAtTopLevel: boolean
  color: Color
}

const AddTagModal: Modal<{ parentTagId?: Id }> = ({
  closeModal,
  parentTagId,
}) => {
  const dispatch = useAppDispatch()

  const { register, handleSubmit } = useForm<Inputs>()
  const onSubmit = ({ name, color, displayAtTopLevel }: Inputs) => {
    closeModal()
    dispatch(addTag({ name, parentTagId, displayAtTopLevel, color }))
  }

  return (
    <FormModal onSubmit={handleSubmit(onSubmit)}>
      <TextField ref={register} name="name" label="Name" />
      <TextField ref={register} name="color" label="Color" />
      <Checkbox
        ref={register}
        name="displayAtTopLevel"
        label="Display at top level"
      />
      <PrimaryButton text="Add" type="submitButton" />
    </FormModal>
  )
}

export const useAddTagModal = () => useModal("Add tag", AddTagModal)
