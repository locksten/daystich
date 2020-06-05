/** @jsx jsx */
import { jsx } from "@emotion/core"
import { BaseButton, CommonButtonProps } from "components/BaseButton"
import { FC, ReactElement } from "react"
import { FaRegStar, FaStar } from "react-icons/fa"
import "twin.macro"

export type IconName = "solidStar" | "emptyStar"

export const NameToIcon: { [key in IconName]: ReactElement } = {
  solidStar: <FaStar />,
  emptyStar: <FaRegStar />,
}

type IconButtonProps = CommonButtonProps & { icon: IconName }

export const IconButton: FC<IconButtonProps> = ({ icon, ...props }) => (
  <BaseButton
    tw="p-2 rounded-full border bg-gray-100 hover:bg-gray-200"
    middle={NameToIcon[icon]}
    {...props}
  ></BaseButton>
)
