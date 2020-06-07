/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Clickable, ClickableProps } from "components/Clickable"
import { FC } from "react"
import "twin.macro"

type SecondaryButton = ClickableProps & { text: string }

export const SecondaryButton: FC<SecondaryButton> = ({ text, ...props }) => (
  <Clickable
    tw="py-1 px-2 rounded-md shadow font-semibold text-white bg-gray-500 active:bg-gray-600"
    {...props}
  >
    <div tw="flex justify-center items-center">{text}</div>
  </Clickable>
)
