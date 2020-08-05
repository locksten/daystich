/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { RHFColorPicker } from "components/ColorPicker"
import { FormErrors } from "components/FormErrors"
import { FormLabel } from "components/FormLabel"
import { useCardListSelectModal } from "components/modals/CardListSelectModal"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { SecondaryButton } from "components/SecondaryButton"
import { RHFTagList } from "components/TagList"
import { RHFTextField } from "components/TextField"
import { useFormWithContext } from "hooks/useFormWithContext"
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

const EditActivityModal: Modal<{ id: Id }> = ({ id, closeModal }) => {
  const dispatch = useAppDispatch()
  const activity = useAppSelector((s) => selectActivityById(s, id))!
  const tag = useAppSelector((s) => selectTagById(s, id))!

  const { RemoveActivityModal, onRemoveActivityClick } = useRemoveActivity(
    activity,
    tag,
  )

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

  const { Form, errors } = useFormWithContext<Inputs>(onSubmit, {
    defaultValues: {
      name: tag.name,
      color: tag?.color,
      tagIds: activity.tagIds,
    },
  })

  type Inputs = {
    name: string
    tagIds: Id[]
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
