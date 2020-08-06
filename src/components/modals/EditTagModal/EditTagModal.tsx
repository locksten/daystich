/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common/common"
import { RHFColorPicker } from "components/ColorPicker"
import { FormErrors } from "components/FormErrors"
import { FormLabel } from "components/FormLabel"
import { useCardListSelectModal } from "components/modals/CardListSelectModal"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { SecondaryButton } from "components/SecondaryButton"
import { RHFTextField } from "components/TextField"
import { useFormWithContext } from "common/useFormWithContext"
import { removeTag, updateTag } from "redux/ducks/shared/actions"
import {
  selectTagById,
  selectTagDescendantIds,
  Tag,
  useSelectTagsUsages,
} from "redux/ducks/tag"
import { useAppSelector } from "redux/redux/rootReducer"
import { useAppDispatch } from "redux/redux/store"
import "twin.macro"

const EditTagModal: Modal<{ id: Id }> = ({ id, closeModal }) => {
  const dispatch = useAppDispatch()
  const tag = useAppSelector((s) => selectTagById(s, id))!

  const { RemoveTagModal, onRemoveTagClick } = useRemoveTag(tag)

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
      color: tag?.color,
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
          text="Delete"
          kind="danger"
          onClick={onRemoveTagClick}
        />
        <PrimaryButton text="Save" type="submitButton" />
        <FormErrors errors={errors} />
      </Form>
      <RemoveTagModal />
    </FormModal>
  )
}

const useRemoveTag = (tag: Tag) => {
  const dispatch = useAppDispatch()

  const tagIds = [
    tag.id,
    ...useAppSelector((s) => selectTagDescendantIds(s, tag.id)),
  ]

  const { isInUse, activityIds, timeSpanIds } = useSelectTagsUsages(tagIds)

  const remove = (replacement?: Tag) =>
    dispatch(
      removeTag({
        id: tag.id,
        affectedTagIds: tagIds,
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
        text="Nothing"
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
