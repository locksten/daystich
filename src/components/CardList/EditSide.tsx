/** @jsx jsx */
import { jsx } from "@emotion/core"
import { IconButton } from "components/IconButton"
import { ModalHookReturnType } from "components/modals/Modal"
import { FC, Fragment } from "react"
import "twin.macro"

export const EditSide: FC<{
  addModal: ModalHookReturnType
  editModal: ModalHookReturnType
}> = ({ addModal, editModal }) => {
  return (
    <Fragment>
      <div tw="grid grid-flow-col gap-1">
        <IconButton
          tw="opacity-75 hover:opacity-100"
          onClick={editModal.open}
          icon="edit"
        />
        <IconButton
          tw="opacity-75 hover:opacity-100"
          onClick={addModal.open}
          icon="add"
        />
      </div>
      <addModal.Modal />
      <editModal.Modal />
    </Fragment>
  )
}
