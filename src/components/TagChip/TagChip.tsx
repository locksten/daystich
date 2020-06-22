/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Id } from "common"
import { useAppSelector } from "ducks/redux/rootReducer"
import { selectTagById, selectTagColor } from "ducks/tag"
import { FC } from "react"
import "twin.macro"
import { Clickable } from "components/Clickable"

export const TagChip: FC<{ id: Id; onClick?: () => void }> = ({
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
