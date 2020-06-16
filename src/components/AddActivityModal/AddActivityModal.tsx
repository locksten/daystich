/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { Checkbox } from "components/Checkbox"
import { Modal, useModal } from "components/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { TextField } from "components/TextField"
import { addActivity } from "ducks/redux/common"
import { useAppDispatch } from "ducks/redux/store"
import { FC } from "react"
import { useForm } from "react-hook-form"
import "twin.macro"

type Inputs = {
  name: string
  displayAtTopLevel: boolean
  color: Color
}

const AddActivityModal: FC<{ parentTagId?: Id }> = ({ parentTagId }) => {
  const dispatch = useAppDispatch()

  const { register, handleSubmit } = useForm<Inputs>()
  const onSubmit = ({ name, displayAtTopLevel, color }: Inputs) => {
    dispatch(
      addActivity({
        activity: { displayAtTopLevel, tagIds: [] },
        activityTag: { name, parentTagId, color },
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
      <Checkbox
        ref={register}
        name="displayAtTopLevel"
        label="Display at top level"
      />
      <div tw="grid grid-flow-col gap-2">
        <PrimaryButton text="Add" type="submitButton" />
      </div>
    </form>
  )
}

export const useAddActivityModal = (parentTagId: Id) => {
  return useModal((props) => (
    <Modal aria-label="Add activity" tw="max-w-xs" {...props}>
      <AddActivityModal parentTagId={parentTagId} />
    </Modal>
  ))
}
