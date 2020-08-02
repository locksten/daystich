/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { TextField } from "components/TextField"
import { addTag } from "redux/ducks/shared/actions"
import { useAppSelector } from "redux/redux/rootReducer"
import { useAppDispatch } from "redux/redux/store"
import { selectTagById, useSelectTagUsages } from "redux/ducks/tag"
import { useForm } from "react-hook-form"

type Inputs = {
  name: string
  color: Color
}

const AddTagModal: Modal<{ parentTagId?: Id }> = ({
  closeModal,
  parentTagId,
}) => {
  const dispatch = useAppDispatch()
  const parentTag = useAppSelector((s) => selectTagById(s, parentTagId || ""))
  const { isInUse } = useSelectTagUsages(parentTagId)

  const { register, handleSubmit } = useForm<Inputs>()
  const onSubmit = ({ name, color }: Inputs) => {
    closeModal()
    dispatch(
      addTag({
        tag: { name, parentTagId, color },
        newParentIsTopLevel: parentTag?.parentTagId === undefined,
        isInUse: isInUse,
      }),
    )
  }

  return (
    <FormModal onSubmit={handleSubmit(onSubmit)}>
      <TextField ref={register({ required: true })} name="name" label="Name" />
      <TextField ref={register} name="color" label="Color" />
      <PrimaryButton text="Add" type="submitButton" />
    </FormModal>
  )
}

export const useAddTagModal = () => useModal("Add tag", AddTagModal)
