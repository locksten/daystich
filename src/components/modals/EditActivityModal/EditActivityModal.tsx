/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { ColorPicker } from "components/ColorPicker"
import { useCardListSelectModal } from "components/modals/CardListSelectModal"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { SecondaryButton } from "components/SecondaryButton"
import { TagList } from "components/TagList"
import { TextField } from "components/TextField"
import { Controller, useForm } from "react-hook-form"
import {
  Activity,
  selectActivityById,
  useSelectActivitiesUsages,
} from "redux/ducks/activity"
import { removeActivity, updateActivity } from "redux/ducks/shared/actions"
import { selectTagById, selectTagDescendantIds, Tag } from "redux/ducks/tag"
import { useAppSelector } from "redux/redux/rootReducer"
import { useAppDispatch } from "redux/redux/store"
import "twin.macro"

type Inputs = {
  name: string
  tagIds: Id[]
  color: Color
}

const EditActivityModal: Modal<{ id: Id }> = ({ id, closeModal }) => {
  const dispatch = useAppDispatch()
  const activity = useAppSelector((s) => selectActivityById(s, id))!
  const tag = useAppSelector((s) => selectTagById(s, id))!

  const { control, register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      name: tag?.name,
      color: tag?.color,
      tagIds: activity.tagIds,
    },
  })

  const onSubmit = ({ name, color, tagIds }: Inputs) => {
    closeModal()
    dispatch(
      updateActivity({
        id,
        activity: { tagIds },
        activityTag: { name, color },
      }),
    )
  }

  const { RemoveActivityModal, onRemoveActivityClick } = useRemoveActivity(
    activity,
    tag,
  )

  return (
    <FormModal onSubmit={handleSubmit(onSubmit)}>
      <TextField ref={register({ required: true })} name="name" label="Name" />
      <div>
        <label htmlFor={"tagIds"}>Color</label>
        <Controller as={<ColorPicker />} name="color" control={control} />
      </div>
      <div>
        <label htmlFor={"tagIds"}>Tags</label>
        <Controller
          as={<TagList wrap={true} />}
          name="tagIds"
          control={control}
        />
      </div>
      <SecondaryButton
        text="Delete"
        kind="danger"
        onClick={onRemoveActivityClick}
      />
      <PrimaryButton text="Save" type="submitButton" />
      <RemoveActivityModal />
    </FormModal>
  )
}

const useRemoveActivity = (activity: Activity, activityTag: Tag) => {
  const dispatch = useAppDispatch()

  const activityIds = [
    activity.id,
    ...useAppSelector((s) => selectTagDescendantIds(s, activity.id)),
  ]

  const { isInUse, timeSpanIds } = useSelectActivitiesUsages(activityIds)

  const remove = (replacement?: Tag) =>
    dispatch(
      removeActivity({
        id: activity.id,
        affectedActivityIds: activityIds,
        affectedTimeSpanIds: timeSpanIds,
        replacementId: replacement?.id,
      }),
    )

  const t = timeSpanIds.length
  const activitySelectModal = useCardListSelectModal()({
    type: "activity",
    filters: { byNotId: activityTag.id },
    title: `Select a replacement for the ${t} timespan${
      t === 1 ? "" : "s"
    } using ${activityTag.name}`,
    onClick: remove,
  })

  return {
    RemoveActivityModal: activitySelectModal.Modal,
    onRemoveActivityClick: () =>
      isInUse ? activitySelectModal.open() : remove(),
  }
}

export const useEditActivityModal = () =>
  useModal("Edit activity", EditActivityModal)
