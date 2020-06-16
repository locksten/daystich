/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { Checkbox } from "components/Checkbox"
import { Modal, useModal } from "components/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { SecondaryButton } from "components/SecondaryButton"
import { TextField } from "components/TextField"
import { selectActivityById } from "ducks/activity"
import {
  removeActivity,
  rootActivityId,
  updateActivity,
} from "ducks/redux/common"
import { useAppSelector } from "ducks/redux/rootReducer"
import { useAppDispatch } from "ducks/redux/store"
import { selectTagById } from "ducks/tag"
import { FC } from "react"
import { useForm } from "react-hook-form"
import "twin.macro"

type Inputs = {
  displayAtTopLevel: boolean
  tagIds: string
  name: string
  color: Color
}

const EditActivityModal: FC<{ id: Id }> = ({ id }) => {
  const dispatch = useAppDispatch()
  const activity = useAppSelector((s) => selectActivityById(s, id))!
  const tag = useAppSelector((s) => selectTagById(s, id))!
  const isRootActivity = activity.id === rootActivityId

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      name: tag?.name,
      color: tag?.color,
      displayAtTopLevel: activity?.displayAtTopLevel,
      tagIds: activity?.tagIds.join(", "),
    },
  })
  const onSubmit = ({ displayAtTopLevel, name, color }: Inputs) => {
    dispatch(
      updateActivity({
        id,
        activity: { displayAtTopLevel },
        activityTag: { name, color },
      }),
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      tw="grid gap-2 w-full rounded-md-4 p-4 bg-white shadow-lg"
    >
      <TextField ref={register} name="name" label="Name" />
      <TextField ref={register} name="color" label="Color" />
      <TextField ref={register} name="tagIds" label="Tag ids" />
      {isRootActivity || (
        <Checkbox
          ref={register}
          name="displayAtTopLevel"
          label="Display at top level"
        />
      )}
      <SecondaryButton
        tw="text-red-600"
        text="Delete"
        onClick={() => dispatch(removeActivity({ id }))}
      />
      <PrimaryButton text="Save" type="submitButton" />
    </form>
  )
}

export const useEditActivityModal = (id: Id) => {
  return useModal((props) => (
    <Modal aria-label="Edit activity" tw="max-w-xs" {...props}>
      <EditActivityModal id={id} />
    </Modal>
  ))
}
