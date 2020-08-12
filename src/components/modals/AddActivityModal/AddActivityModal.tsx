/** @jsx jsx */
import { jsx } from "@emotion/core"
import { useFormWithContext } from "common/useFormWithContext"
import { RHFColorPicker } from "components/ColorPicker"
import { FormErrors } from "components/FormErrors"
import { FormLabel } from "components/FormLabel"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { RHFTagList } from "components/TagList"
import { RHFTextField } from "components/TextField"
import { addActivity } from "redux/ducks/activity/activity"
import { ActivityId } from "redux/ducks/activity/types"
import { TagId } from "redux/ducks/tag/types"
import { useAppDispatch } from "redux/redux/store"
import { Color } from "styling/color"
import "twin.macro"

const AddActivityModal: Modal<{ parentId?: ActivityId }> = ({
  parentId,
  closeModal,
}) => {
  const dispatch = useAppDispatch()

  const onSubmit = ({ name, color, tagIds }: Inputs) => {
    closeModal()
    dispatch(
      addActivity({
        name,
        parentId,
        color,
        tagIds,
      }),
    )
  }

  const { Form, errors } = useFormWithContext<Inputs>(onSubmit)

  type Inputs = {
    name: string
    tagIds: TagId[]
    color?: Color
  }

  return (
    <FormModal>
      <Form tw="grid gap-2">
        <FormLabel name="name" label="Name">
          <RHFTextField
            name="name"
            rules={{
              required: "Name is required",
            }}
          />
        </FormLabel>
        <RHFColorPicker name="color" />
        <FormLabel name="tagIds" label="Tags">
          <RHFTagList name="tagIds" />
        </FormLabel>
        <PrimaryButton text="Add" type="submitButton" />
        <FormErrors errors={errors} />
      </Form>
    </FormModal>
  )
}

export const useAddActivityModal = () =>
  useModal("Add activity", AddActivityModal)
