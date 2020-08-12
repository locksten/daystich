/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Modal, useModal } from "components/modals/Modal"
import "twin.macro"
import { TagId } from "redux/ducks/tag/types"
import { useAppDispatch } from "redux/redux/store"
import { addTag } from "redux/ducks/tag/tag"
import { useFormWithContext } from "common/useFormWithContext"
import { Color } from "styling/color"
import { FormModal } from "components/modals/FormModal"
import { FormLabel } from "components/FormLabel"
import { RHFTextField } from "components/TextField"
import { RHFColorPicker } from "components/ColorPicker"
import { PrimaryButton } from "components/PrimaryButton"
import { FormErrors } from "components/FormErrors"

const AddTagModal: Modal<{ parentId?: TagId }> = ({ closeModal, parentId }) => {
  const dispatch = useAppDispatch()

  const onSubmit = ({ name, color }: Inputs) => {
    closeModal()
    dispatch(
      addTag({
        name,
        parentId,
        color,
      }),
    )
  }

  const { Form, errors } = useFormWithContext<Inputs>(onSubmit)

  type Inputs = {
    name: string
    color?: Color
  }

  return (
    <FormModal>
      <Form tw="grid gap-2">
        <FormLabel name="name" label="Name">
          <RHFTextField name="name" rules={{ required: "Name is required" }} />
        </FormLabel>
        <RHFColorPicker name="color" />
        <PrimaryButton text="Add" type="submitButton" />
        <FormErrors errors={errors} />
      </Form>
    </FormModal>
  )
}

export const useAddTagModal = () => useModal("Add tag", AddTagModal)
