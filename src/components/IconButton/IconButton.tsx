/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Clickable, ClickableProps } from "components/Clickable"
import { FC, ReactElement } from "react"
import { FaRegStar, FaStar } from "react-icons/fa"
import "twin.macro"

export type IconName = "solidStar" | "emptyStar"

export const NameToIcon: { [key in IconName]: ReactElement } = {
  solidStar: <FaStar />,
  emptyStar: <FaRegStar />,
}

type IconButtonProps = ClickableProps & { icon: IconName }

export const IconButton: FC<IconButtonProps> = ({ icon, ...props }) => (
  <Clickable
    tw="p-2 rounded-full border bg-gray-100 hover:bg-gray-200"
    {...props}
  >
    <div tw="flex justify-center items-center">{NameToIcon[icon]}</div>
  </Clickable>
)
