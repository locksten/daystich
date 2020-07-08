/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { Checkbox } from "components/Checkbox"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { TagList } from "components/TagList"
import { TextField } from "components/TextField"
import { useAppDispatch } from "ducks/redux/store"
import { Controller, useForm } from "react-hook-form"
import "twin.macro"
import { addActivity } from "ducks/actions"
import { useSelectActivityUsages } from "ducks/activity"

type Inputs = {
  name: string
  tagIds: Id[]
  displayAtTopLevel: boolean
  color: Color
}

const AddActivityModal: Modal<{ parentTagId?: Id }> = ({
  parentTagId,
  closeModal,
}) => {
  const dispatch = useAppDispatch()

  const { inUse } = useSelectActivityUsages(parentTagId)

  const { control, register, handleSubmit } = useForm<Inputs>()
  const onSubmit = ({ name, displayAtTopLevel, color, tagIds }: Inputs) => {
    closeModal()
    dispatch(
      addActivity({
        activity: { tagIds },
        activityTag: { name, parentTagId, displayAtTopLevel, color },
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
