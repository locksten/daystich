/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { Checkbox } from "components/Checkbox"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { SecondaryButton } from "components/SecondaryButton"
import { TextField } from "components/TextField"
import { useAppSelector } from "ducks/redux/rootReducer"
import { useAppDispatch } from "ducks/redux/store"
import { isRootTag, removeTag, selectTagById, updateTag } from "ducks/tag"
import { useForm } from "react-hook-form"
import "twin.macro"

export type Inputs = {
  name: string
  color: Color
  displayAtTopLevel: boolean
}

const EditTagModal: Modal<{ id: Id }> = ({ id, closeModal }) => {
  const dispatch = useAppDispatch()
  const tag = useAppSelector((s) => selectTagById(s, id))!

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      name: tag?.name,
      color: tag?.color,
      displayAtTopLevel: tag.displayAtTopLevel,
    },
  })

  const onSubmit = (inputs: Inputs) => {
    closeModal()
    dispatch(updateTag({ ...inputs, id }))
  }

  return (
    <FormModal onSubmit={handleSubmit(onSubmit)}>
      <TextField ref={register} name="name" label="Name" />
      <TextField ref={register} name="color" label="Color" />
      {isRootTag(tag) || (
        <Checkbox
          ref={register}
          name="displayAtTopLevel"
          label="Display at top level"
        />
      )}
      <SecondaryButton
        tw="text-red-600"
        text="Delete"
        onClick={() => dispatch(removeTag({ id }))}
      />
      <PrimaryButton text="Save" type="submitButton" />
    </FormModal>
  )
}

export const useEditTagModal = () => useModal("Edit tag", EditTagModal)
