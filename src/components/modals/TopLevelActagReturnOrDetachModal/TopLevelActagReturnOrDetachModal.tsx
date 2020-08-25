/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FormModal } from "components/modals/FormModal"
import { Modal, useModal } from "components/modals/Modal"
import { SecondaryButton } from "components/SecondaryButton"
import {
  detachTopLevelActivityFromParent,
  returnTopLevelActivityToParent,
} from "redux/ducks/activity/activity"
import { selectActivityById } from "redux/ducks/activity/selectors"
import { Activity } from "redux/ducks/activity/types"
import { selectTagById } from "redux/ducks/tag/selectors"
import {
  detachTopLevelTagFromParent,
  returnTopLevelTagToParent,
} from "redux/ducks/tag/tag"
import { Tag } from "redux/ducks/tag/types"
import { useAppSelector } from "redux/redux/rootReducer"
import { useAppDispatch } from "redux/redux/store"
import "twin.macro"

const TopLevelActagReturnOrDetachModal: Modal<{ entity: Activity | Tag }> = ({
  closeModal,
  entity,
}) => {
  const dispatch = useAppDispatch()

  const parent = useAppSelector((s) =>
    entity._type === "activity"
      ? selectActivityById(s, entity.parentId!)!
      : selectTagById(s, entity.parentId!)!,
  )

  return (
    <FormModal tw="grid gap-2">
      <SecondaryButton
        label={`Return ${entity.name} to ${parent.name}`}
        onClick={() => {
          dispatch(
            entity._type === "activity"
              ? returnTopLevelActivityToParent({ id: entity.id })
              : returnTopLevelTagToParent({ id: entity.id }),
          )
          closeModal()
        }}
      />
      <SecondaryButton
        label={`Detach ${entity.name} from ${parent.name}`}
        onClick={() => {
          dispatch(
            entity._type === "activity"
              ? detachTopLevelActivityFromParent({ id: entity.id })
              : detachTopLevelTagFromParent({ id: entity.id }),
          )
          closeModal()
        }}
      />
    </FormModal>
  )
}

export const useTopLevelReturnDetachModal = () =>
  useModal("Return or detach top level item", TopLevelActagReturnOrDetachModal)
