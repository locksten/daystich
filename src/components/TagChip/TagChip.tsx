/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Clickable } from "components/Clickable"
import { FC } from "react"
import { useAppSelector } from "redux/redux/rootReducer"
import "twin.macro"
import { TagId } from "redux/ducks/tag/types"
import { selectTagById, selectTagColor } from "redux/ducks/tag/selectors"

export const TagChip: FC<{ id: TagId; onClick?: () => void }> = ({
  id,
  onClick,
  ...props
}) => {
  const tag = useAppSelector((s) => selectTagById(s, id))!
  const color = useAppSelector((s) => selectTagColor(s, id))
  return (
    <Clickable
      onClick={onClick}
      tw="text-white whitespace-no-wrap rounded-full py-1 px-3"
      css={{ backgroundColor: color }}
      {...props}
    >
      {tag.name}
    </Clickable>
  )
}
