/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { RHFControlledElementWrapper } from "common/RHFElementWrapper"
import { IconButton } from "components/IconButton"
import { useCardListSelectModal } from "components/modals/CardListSelectModal"
import { TagChip } from "components/TagChip"
import { FC, Fragment } from "react"
import "twin.macro"
import tw from "twin.macro"
import { TagId } from "redux/ducks/tag/types"

export const TagList: FC<{
  value?: TagId[]
  onChange?: (ids: TagId[]) => void
  showAddButton?: "onGroupHover" | "always"
  wrap?: boolean
}> = ({ value: ids = [], onChange, showAddButton = "always", wrap = true }) => {
  const tagSelectModal = useCardListSelectModal()({
    type: "tag",
    onClick: (tag) => {
      onChange?.(ids.includes(tag.id) ? ids : [...ids, tag.id])
    },
  })

  return (
    <Fragment>
      <div
        css={css`
          ${tw`flex`};
          ${wrap && tw`flex-wrap`}
        `}
      >
        {ids.map((id) => (
          <TagChip
            tw="m-1"
            key={id}
            id={id}
            onClick={() => {
              onChange?.(ids.filter((i) => i !== id))
            }}
          />
        ))}
        <IconButton
          tw="m-1"
          onClick={tagSelectModal.open}
          css={css`
            ${showAddButton === "onGroupHover" &&
            tw`opacity-0 group-hover:opacity-100`}
          `}
          background="circle"
          icon="add"
        />
      </div>
      <tagSelectModal.Modal />
    </Fragment>
  )
}

export const RHFTagList = RHFControlledElementWrapper({
  Element: TagList,
  defaultValue: [],
})
