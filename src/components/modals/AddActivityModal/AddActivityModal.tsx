/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { RHFColorPicker } from "components/ColorPicker"
import { FormErrors } from "components/FormErrors"
import { FormLabel } from "components/FormLabel"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { RHFTagList } from "components/TagList"
import { RHFTextField } from "components/TextField"
import { useFormWithContext } from "hooks/useFormWithContext"
import { isRootActivityId } from "redux/common"
import { useSelectActivityUsages } from "redux/ducks/activity"
import { addActivity } from "redux/ducks/shared/actions"
import { selectTagById } from "redux/ducks/tag"
import { useAppSelector } from "redux/redux/rootReducer"
import { useAppDispatch } from "redux/redux/store"
import "twin.macro"

const AddActivityModal: Modal<{ parentTagId?: Id }> = ({
  parentTagId,
  closeModal,
}) => {
  const dispatch = useAppDispatch()
  const parentTag = useAppSelector((s) => selectTagById(s, parentTagId || ""))
  const { isInUse } = useSelectActivityUsages(parentTagId)

  const onSubmit = ({ name, color, tagIds }: Inputs) => {
    closeModal()
    dispatch(
      addActivity({
        activity: { tagIds },
        activityTag: {
          name,
          parentTagId,
          color,
        },
        newParentIsTopLevel: isRootActivityId(parentTag?.parentTagId),
        isInUse,
      }),
    )
  }

  const { Form, errors } = useFormWithContext<Inputs>(onSubmit)

  type Inputs = {
    name: string
    tagIds: Id[]
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
