/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { Checkbox } from "components/Checkbox"
import { useCardListSelectModal } from "components/modals/CardListSelectModal"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { SecondaryButton } from "components/SecondaryButton"
import { TagList } from "components/TagList"
import { TextField } from "components/TextField"
import { removeActivity, updateActivity } from "ducks/actions"
import { selectActivityById } from "ducks/activity"
import { useAppSelector } from "ducks/redux/rootReducer"
import { useAppDispatch } from "ducks/redux/store"
import { selectTagById, selectTagDescendantIds } from "ducks/tag"
import { selectTimespanIdsByActivityIds } from "ducks/timeSpan"
import { Controller, useForm } from "react-hook-form"
import "twin.macro"

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

  const { RemoveActivityModal, onRemoveActivityClick } = useRemoveActivity(id)

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
        onClick={onRemoveActivityClick}
      />
      <PrimaryButton text="Save" type="submitButton" />
      <RemoveActivityModal />
    </FormModal>
  )
}

const useRemoveActivity = (id: Id) => {
  const dispatch = useAppDispatch()

  const activityIds = [
    id,
    ...useAppSelector((s) => selectTagDescendantIds(s, id)),
  ]

  const timeSpanIds = useAppSelector((s) =>
    selectTimespanIdsByActivityIds(s, activityIds),
  )

  const n = timeSpanIds.length
  const activitySelectModal = useCardListSelectModal()({
    type: "activity",
    title: `Select replacement for ${n} timespan${n === 1 ? "" : "s"}`,
    onClick: (replacement) =>
      dispatch(
        removeActivity({
          id,
          affectedTimeSpanIds: timeSpanIds,
          replacementId: replacement.id,
        }),
      ),
  })

  return {
    RemoveActivityModal: activitySelectModal.Modal,
    onRemoveActivityClick: () =>
      timeSpanIds.length === 0
        ? dispatch(removeActivity({ id, affectedTimeSpanIds: [] }))
        : activitySelectModal.open(),
  }
}

export const useEditActivityModal = () =>
  useModal("Edit activity", EditActivityModal)
