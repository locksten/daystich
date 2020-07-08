/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import { Clickable, ClickableProps } from "components/Clickable"
import { FC } from "react"
import "twin.macro"
import tw from "twin.macro"

type SecondaryButton = ClickableProps & {
  text: string
  kind?: "normal" | "danger"
}

export const SecondaryButton: FC<SecondaryButton> = ({
  text,
  kind = "normal",
  ...props
}) => (
  <Clickable
    css={css`
      ${tw`py-1 px-2 rounded-md shadow font-semibold text-white bg-gray-500 active:bg-gray-600`};
      ${kind === "danger" && tw`text-red-600`};
    `}
    {...props}
  >
    <div tw="flex justify-center items-center">{text}</div>
  </Clickable>
)
