/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Modal, useModal } from "components/modals/Modal"
import { Color } from "styling/color"
import "twin.macro"
import { ActivityId, Activity } from "redux/ducks/activity/types"
import { TagId } from "redux/ducks/tag/types"
import { useAppSelector } from "redux/redux/rootReducer"
import {
  selectActivityById,
  selectActivitiesUsages,
  selectActivityDescendantIds,
} from "redux/ducks/activity/selectors"
import { useFormWithContext } from "common/useFormWithContext"
import { FormModal } from "components/modals/FormModal"
import { FormLabel } from "components/FormLabel"
import { RHFTextField } from "components/TextField"
import { RHFColorPicker } from "components/ColorPicker"
import { RHFTagList } from "components/TagList"
import { SecondaryButton } from "components/SecondaryButton"
import { PrimaryButton } from "components/PrimaryButton"
import { FormErrors } from "components/FormErrors"
import { useAppDispatch } from "redux/redux/store"
import { useCardListSelectModal } from "components/modals/CardListSelectModal"
import { removeActivity, updateActivity } from "redux/ducks/activity/activity"

const EditActivityModal: Modal<{ id: ActivityId }> = ({ id, closeModal }) => {
  const dispatch = useAppDispatch()
  const activity = useAppSelector((s) => selectActivityById(s, id))!

  const {
    RemoveActivityModal,
    onRemoveActivityClick,
  } = useRemoveActivityWithModal(activity)

  const onSubmit = ({ name, color, tagIds }: Inputs) => {
    closeModal()
    dispatch(
      updateActivity({
        id,
        tagIds,
        name,
        color,
      }),
    )
  }

  const { Form, errors } = useFormWithContext<Inputs>(onSubmit, {
    defaultValues: {
      name: activity.name,
      color: activity.color,
      tagIds: activity.tagIds,
    },
  })

  type Inputs = {
    name: string
    tagIds: TagId[]
    color?: Color
  }

  return (
    <FormModal>
      <Form tw="grid gap-2">
        <FormLabel name="name" label="Name">
          <RHFTextField name="name" rules={{ required: "Name is required" }} />
        </FormLabel>
        <RHFColorPicker name="color" />
        <FormLabel name="tagIds" label="Tags">
          <RHFTagList name="tagIds" />
        </FormLabel>
        <SecondaryButton
          text="Delete"
          kind="danger"
          onClick={onRemoveActivityClick}
        />
        <PrimaryButton text="Save" type="submitButton" />
        <FormErrors errors={errors} />
        <RemoveActivityModal />
      </Form>
    </FormModal>
  )
}

const useRemoveActivityWithModal = (activity: Activity) => {
  const dispatch = useAppDispatch()

  const otherAffectedActivityIds = useAppSelector((s) =>
    selectActivityDescendantIds(s, activity.id),
  )

  const { isInUse, timeSpanIds } = useAppSelector((s) =>
    selectActivitiesUsages(s, [...otherAffectedActivityIds, activity.id]),
  )

  const remove = (replacement?: Activity) =>
    dispatch(
      removeActivity({
        id: activity.id,
        otherAffectedActivityIds,
        affectedTimeSpanIds: timeSpanIds,
        replacementId: replacement?.id,
      }),
    )

  const t = timeSpanIds.length
  const activitySelectModal = useCardListSelectModal()({
    type: "activity",
    onClick: remove,
    filters: { byNotId: activity.id },
    title: `Select a replacement for the ${t} timespan${
      t === 1 ? "" : "s"
    } using ${activity.name}`,
  })

  return {
    RemoveActivityModal: activitySelectModal.Modal,
    onRemoveActivityClick: () =>
      isInUse ? activitySelectModal.open() : remove(),
  }
}

export const useEditActivityModal = () =>
  useModal("Edit activity", EditActivityModal)
