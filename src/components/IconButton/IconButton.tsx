/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import { Clickable, ClickableProps } from "components/Clickable"
import { FC } from "react"
import { FaRegStar, FaStar, FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import "twin.macro"
import tw from "twin.macro"

export type IconName = keyof typeof Icons

export const Icons = {
  solidStar: <FaStar />,
  emptyStar: <FaRegStar />,
  add: <FaPlus />,
  edit: <MdEdit />,
}

type IconButtonProps = ClickableProps & {
  icon: IconName
  background?: "circle" | "none"
}

export const IconButton: FC<IconButtonProps> = ({
  icon,
  background = "none",
  ...props
}) => (
  <Clickable
    css={css`
      ${tw`flex justify-center items-center`}
      ${background === "circle" &&
      tw`p-2 rounded-full text-white bg-gray-400 hover:bg-gray-500`}
    `}
    {...props}
  >
    {Icons[icon]}
  </Clickable>
)
