/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Color, Id } from "common"
import { Checkbox } from "components/Checkbox"
import { useCardListSelectModal } from "components/modals/CardListSelectModal"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { SecondaryButton } from "components/SecondaryButton"
import { TextField } from "components/TextField"
import { removeTag, updateTag } from "redux/ducks/shared/actions"
import { useAppSelector } from "redux/redux/rootReducer"
import { useAppDispatch } from "redux/redux/store"
import {
  isRootTag,
  selectTagById,
  selectTagDescendantIds,
  Tag,
  useSelectTagsUsages,
} from "redux/ducks/tag"
import { useForm } from "react-hook-form"
import "twin.macro"

export type Inputs = {
  name: string
  color: Color
}

const EditTagModal: Modal<{ id: Id }> = ({ id, closeModal }) => {
  const dispatch = useAppDispatch()
  const tag = useAppSelector((s) => selectTagById(s, id))!

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      name: tag?.name,
      color: tag?.color,
    },
  })

  const onSubmit = (inputs: Inputs) => {
    closeModal()
    dispatch(updateTag({ ...inputs, id }))
  }

  const { RemoveTagModal, onRemoveTagClick } = useRemoveTag(tag)

  return (
    <FormModal onSubmit={handleSubmit(onSubmit)}>
      <TextField ref={register} name="name" label="Name" />
      <TextField ref={register} name="color" label="Color" />
      <SecondaryButton text="Delete" kind="danger" onClick={onRemoveTagClick} />
      <PrimaryButton text="Save" type="submitButton" />
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
