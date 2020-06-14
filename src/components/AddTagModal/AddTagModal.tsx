/** @jsx jsx */
import { jsx } from "@emotion/core"
import { nanoid } from "@reduxjs/toolkit"
import { Id, Color } from "common"
import { Input } from "components/Input"
import { CenteredModal } from "components/Modal"
import { PrimaryButton } from "components/PrimaryButton"
import { useAppDispatch } from "ducks/redux/store"
import { addTag } from "ducks/tag"
import { FC, Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import "twin.macro"

type Inputs = {
  name: string
  displayAtTopLevel: boolean
  color: Color
}

const AddTagModal: FC<{ parentTagId: Id }> = ({ parentTagId }) => {
  const dispatch = useAppDispatch()

  const { register, handleSubmit } = useForm<Inputs>()
  const onSubmit = ({ name, displayAtTopLevel, color }: Inputs) => {
    dispatch(
      addTag({ id: nanoid(), name, parentTagId, displayAtTopLevel, color }),
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      tw="grid gap-2 w-full rounded-md-4 p-4 bg-white shadow-lg"
    >
      <Input ref={register} name="name" label="Name" />
      <Input ref={register} name="color" label="Color" />
      <div tw="flex items-center">
        <label tw="pr-2" htmlFor="displayAtTopLevel">
          displayAtTopLevel
        </label>
        <input ref={register} name="displayAtTopLevel" type="checkbox" />
      </div>
      <div tw="grid grid-flow-col gap-2">
        <PrimaryButton text="Add" type="submitButton" />
      </div>
    </form>
  )
}

export const useAddTagModal = (parentTagId: Id) => {
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return {
    Modal: () => (
      <Fragment>
        {isOpen && (
          <CenteredModal
            aria-label="Add tag"
            tw="max-w-xs"
            isOpen={isOpen}
            onDismiss={close}
          >
            <AddTagModal parentTagId={parentTagId} />
          </CenteredModal>
        )}
      </Fragment>
    ),
    openModal: open,
  }
}
