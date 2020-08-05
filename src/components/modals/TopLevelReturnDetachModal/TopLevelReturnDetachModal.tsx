/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Id } from "common"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { SecondaryButton } from "components/SecondaryButton"
import { isRootActivity, rootActivityId } from "redux/common"
import { selectActivityById } from "redux/ducks/activity"
import { moveActivity, moveTag } from "redux/ducks/shared/actions"
import { isRootTag, selectTagById } from "redux/ducks/tag"
import { useAppSelector } from "redux/redux/rootReducer"
import { useAppDispatch } from "redux/redux/store"
import "twin.macro"

const TopLevelReturnDetachModal: Modal<{ id: Id }> = ({ closeModal, id }) => {
  const dispatch = useAppDispatch()
  const tag = useAppSelector((s) => selectTagById(s, id))!
  const activity = useAppSelector((s) => selectActivityById(s, id))
  const parent = useAppSelector((s) => selectTagById(s, tag.parentTagId!))!

  const detachFromParent = () =>
    dispatch(
      activity
        ? moveActivity({
            id: activity.id,
            newParentId: rootActivityId,
            newParentIsTopLevel: false,
            newPosition: undefined,
            isInUse: false,
          })
        : moveTag({
            id: tag.id,
            newParentId: undefined,
            newPosition: undefined,
            newParentIsTopLevel: false,
            isInUse: false,
          }),
    )

  const returnToParent = () =>
    dispatch(
      activity
        ? moveActivity({
            id: activity.id,
            newParentId: tag.parentTagId,
            newPosition: tag.ordering,
            newParentIsTopLevel: isRootActivity(parent),
            isInUse: false,
          })
        : moveTag({
            id: tag.id,
            newParentId: tag.parentTagId,
            newPosition: tag.ordering,
            newParentIsTopLevel: isRootTag(parent),
            isInUse: false,
          }),
    )

  return (
    <FormModal tw="grid gap-2">
      <SecondaryButton
        text={`Return ${tag.name} to ${parent.name}`}
        onClick={() => {
          returnToParent()
          closeModal()
        }}
      />
      <SecondaryButton
        text={`Detach ${tag.name} from ${parent.name}`}
        onClick={() => {
          detachFromParent()
          closeModal()
        }}
      />
    </FormModal>
  )
}

export const useTopLevelReturnDetachModal = () =>
  useModal("Return or detach top level item", TopLevelReturnDetachModal)
