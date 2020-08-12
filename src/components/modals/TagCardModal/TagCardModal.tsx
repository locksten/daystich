/** @jsx jsx */
import { jsx } from "@emotion/core"
import { TagCardList } from "components/CardList/TagCardList"
import { Modal, useModal } from "components/modals/Modal"
import { FC, useRef } from "react"
import "twin.macro"
import { TagId, Tag } from "redux/ducks/tag/types"

const TagCardModal: Modal<{ id: TagId; onClick: (tag: Tag) => void }> = ({
  onClick,
  id,
  closeModal,
  ...props
}) => {
  return (
    <TagCardList
      id={id}
      config={{
        singleColumn: true,
      }}
      singleConfig={{
        onLeafClick: (actag) => {
          closeModal()
          onClick(actag)
        },
      }}
      {...props}
    />
  )
}

export const useTagCardModal = (args: {
  id: TagId
  onClick: (tag: Tag) => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const modal = useModal(
    "Tag card",
    TagCardModal,
    ref.current?.getBoundingClientRect(),
  )

  const Parent: FC = ({ children, ...props }) => (
    <div ref={ref} tw="relative" {...props}>
      {children}
    </div>
  )

  return {
    Parent,
    ...modal(args),
  }
}
