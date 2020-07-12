/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { TagList } from "components/TagList"
import { TextField } from "components/TextField"
import { addActivity } from "redux/ducks/shared/actions"
import { useSelectActivityUsages } from "redux/ducks/activity"
import { isRootActivityId } from "redux/common"
import { useAppSelector } from "redux/redux/rootReducer"
import { useAppDispatch } from "redux/redux/store"
import { selectTagById } from "redux/ducks/tag"
import { Controller, useForm } from "react-hook-form"
import "twin.macro"

type Inputs = {
  name: string
  tagIds: Id[]
  color: Color
}

const AddActivityModal: Modal<{ parentTagId?: Id }> = ({
  parentTagId,
  closeModal,
}) => {
  const dispatch = useAppDispatch()
  const parentTag = useAppSelector((s) => selectTagById(s, parentTagId || ""))
  const { isInUse } = useSelectActivityUsages(parentTagId)

  const { control, register, handleSubmit } = useForm<Inputs>()
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

  return (
    <FormModal onSubmit={handleSubmit(onSubmit)}>
      <TextField ref={register} name="name" label="Name" />
      <TextField ref={register} name="color" label="Color" />
      <div>
        <label htmlFor={"tagIds"}>Tags</label>
        <Controller
          as={<TagList wrap={true} />}
          name="tagIds"
          control={control}
          defaultValue={[]}
        />
      </div>
      <PrimaryButton text="Add" type="submitButton" />
    </FormModal>
  )
}

export const useAddActivityModal = () =>
  useModal("Add activity", AddActivityModal)
