/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Id } from "common"
import { TagCardList } from "components/ActivitySection/CardList"
import { Modal, useModal } from "components/modals/Modal"
import { Tag } from "ducks/tag"
import "twin.macro"
import { useRef, FC } from "react"

const TagCardModal: Modal<{ id: Id; onClick: (tag: Tag) => void }> = ({
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
        onLeafClick: ({ tag }) => {
          closeModal()
          onClick(tag)
        },
      }}
      {...props}
    />
  )
}

export const useTagCardModal = (args: {
  id: Id
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
