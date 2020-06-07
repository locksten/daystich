/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Clickable, ClickableProps } from "components/Clickable"
import { FC } from "react"
import "twin.macro"

type PrimaryButtonProps = ClickableProps & { text: string }

export const PrimaryButton: FC<PrimaryButtonProps> = ({ text, ...props }) => (
  <Clickable
    tw="py-1 px-2 rounded-md shadow text-white font-semibold bg-gray-700 active:bg-gray-900"
    {...props}
  >
    <div tw="flex justify-center items-center">{text}</div>
  </Clickable>
)
