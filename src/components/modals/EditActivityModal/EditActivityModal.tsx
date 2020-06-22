/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { Checkbox } from "components/Checkbox"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { SecondaryButton } from "components/SecondaryButton"
import { TagList } from "components/TagList"
import { TextField } from "components/TextField"
import { selectActivityById } from "ducks/activity"
import { useAppSelector } from "ducks/redux/rootReducer"
import { useAppDispatch } from "ducks/redux/store"
import { selectTagById } from "ducks/tag"
import { Controller, useForm } from "react-hook-form"
import "twin.macro"
import { FormModal } from "components/modals/FormModal"
import { updateActivity, removeActivity } from "ducks/actions"

type Inputs = {
  name: string
  tagIds: Id[]
  color: Color
  displayAtTopLevel: boolean
}

const EditActivityModal: Modal<{ id: Id }> = ({ id, closeModal }) => {
  const dispatch = useAppDispatch()
  const activity = useAppSelector((s) => selectActivityById(s, id))!
  const tag = useAppSelector((s) => selectTagById(s, id))!

  const { control, register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      name: tag?.name,
      color: tag?.color,
      displayAtTopLevel: tag.displayAtTopLevel,
      tagIds: activity.tagIds,
    },
  })

  const onSubmit = ({ displayAtTopLevel, name, color, tagIds }: Inputs) => {
    closeModal()
    dispatch(
      updateActivity({
        id,
        activity: { tagIds },
        activityTag: { displayAtTopLevel, name, color },
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
        />
      </div>
      <SecondaryButton
        tw="text-red-600"
        text="Delete"
        onClick={() => dispatch(removeActivity({ id }))}
      />
      <PrimaryButton text="Save" type="submitButton" />
    </FormModal>
  )
}

export const useEditActivityModal = () =>
  useModal("Edit activity", EditActivityModal)
