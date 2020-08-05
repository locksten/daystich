/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { RHFColorPicker } from "components/ColorPicker"
import { FormErrors } from "components/FormErrors"
import { FormLabel } from "components/FormLabel"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { RHFTextField } from "components/TextField"
import { useFormWithContext } from "hooks/useFormWithContext"
import { addTag } from "redux/ducks/shared/actions"
import { selectTagById, useSelectTagUsages } from "redux/ducks/tag"
import { useAppSelector } from "redux/redux/rootReducer"
import { useAppDispatch } from "redux/redux/store"
import "twin.macro"

const AddTagModal: Modal<{ parentTagId?: Id }> = ({
  closeModal,
  parentTagId,
}) => {
  const dispatch = useAppDispatch()
  const parentTag = useAppSelector((s) => selectTagById(s, parentTagId || ""))
  const { isInUse } = useSelectTagUsages(parentTagId)

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
