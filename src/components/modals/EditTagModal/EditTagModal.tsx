/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Modal, useModal } from "components/modals/Modal"
import { TagId, Tag } from "redux/ducks/tag/types"
import { Color } from "styling/color"
import "twin.macro"
import { useAppSelector } from "redux/redux/rootReducer"
import {
  selectTagById,
  selectTagDescendantIds,
  selectTagsUsages,
} from "redux/ducks/tag/selectors"
import { useFormWithContext } from "common/useFormWithContext"
import { FormModal } from "components/modals/FormModal"
import { FormLabel } from "components/FormLabel"
import { RHFTextField } from "components/TextField"
import { RHFColorPicker } from "components/ColorPicker"
import { SecondaryButton } from "components/SecondaryButton"
import { PrimaryButton } from "components/PrimaryButton"
import { FormErrors } from "components/FormErrors"
import { useAppDispatch } from "redux/redux/store"
import { removeTag, updateTag } from "redux/ducks/tag/tag"
import { useCardListSelectModal } from "components/modals/CardListSelectModal"

const EditTagModal: Modal<{ id: TagId }> = ({ id, closeModal }) => {
  const dispatch = useAppDispatch()
  const tag = useAppSelector((s) => selectTagById(s, id))!

  const { RemoveTagModal, onRemoveTagClick } = useRemoveTagWithModal(tag)

  const onSubmit = ({ name, color }: Inputs) => {
    closeModal()
    dispatch(
      updateTag({
        id,
        name,
        color,
      }),
    )
  }

  const { Form, errors } = useFormWithContext<Inputs>(onSubmit, {
    defaultValues: {
      name: tag.name,
      color: tag.color,
    },
  })

  type Inputs = {
    name: string
    color?: Color
  }

  return (
    <FormModal>
      <Form tw="grid gap-2">
        <FormLabel name="name" label="Name">
          <RHFTextField name="name" rules={{ required: "Name is required" }} />
        </FormLabel>
        <RHFColorPicker name="color" />
        <SecondaryButton
          label="Delete"
          kind="danger"
          onClick={onRemoveTagClick}
        />
        <PrimaryButton label="Save" type="submitButton" />
        <FormErrors errors={errors} />
      </Form>
      <RemoveTagModal />
    </FormModal>
  )
}

const useRemoveTagWithModal = (tag: Tag) => {
  const dispatch = useAppDispatch()

  const otherAffectedTagIds = useAppSelector((s) =>
    selectTagDescendantIds(s, tag.id),
  )

  const { isInUse, activityIds, timeSpanIds } = useAppSelector((s) =>
    selectTagsUsages(s, [...otherAffectedTagIds, tag.id]),
  )

  const remove = (replacement?: Tag) =>
    dispatch(
      removeTag({
        id: tag.id,
        otherAffectedTagIds,
        affectedActivityIds: activityIds,
        affectedTimeSpanIds: timeSpanIds,
        replacementId: replacement?.id,
      }),
    )

  const t = timeSpanIds.length
  const a = activityIds.length
  const tagSelectModal = useCardListSelectModal()({
    type: "tag",
    filters: { byNotId: tag.id },
    title: `Select a replacement for the ${t} timespan${
      t === 1 ? "" : "s"
    } and ${a} activit${a === 1 ? "y" : "ies"} using ${tag.name}`,
    RenderBelowTitle: (
      <SecondaryButton
        tw="w-full"
        kind="danger"
        label="Nothing"
        onClick={() => {
          tagSelectModal.close()
          remove()
        }}
      />
    ),
    onClick: remove,
  })

  return {
    RemoveTagModal: tagSelectModal.Modal,
    onRemoveTagClick: () => (isInUse ? tagSelectModal.open() : remove()),
  }
}

export const useEditTagModal = () => useModal("Edit tag", EditTagModal)
