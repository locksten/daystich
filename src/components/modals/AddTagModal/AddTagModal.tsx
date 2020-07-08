/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { Checkbox } from "components/Checkbox"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { TextField } from "components/TextField"
import { addTag } from "ducks/actions"
import { useAppDispatch } from "ducks/redux/store"
import { useForm } from "react-hook-form"
import { useSelectTagUsages } from "ducks/tag"

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

  const { inUse } = useSelectTagUsages(parentTagId)

  const { register, handleSubmit } = useForm<Inputs>()
  const onSubmit = ({ name, color, displayAtTopLevel }: Inputs) => {
    closeModal()
    dispatch(
      addTag({
        tag: { name, parentTagId, displayAtTopLevel, color },
        isInUse: inUse,
      }),
    )
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
