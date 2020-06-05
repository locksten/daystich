/** @jsx jsx */
import { jsx } from "@emotion/core"
import { BaseButton, CommonButtonProps } from "components/BaseButton"
import { FC } from "react"
import "twin.macro"

type SecondaryButton = CommonButtonProps & { text: string }

export const SecondaryButton: FC<SecondaryButton> = ({ text, ...props }) => (
  <BaseButton
    tw="py-1 px-2 rounded-md font-semibold text-teal-500 bg-gray-200 active:bg-gray-300"
    middle={text}
    {...props}
  ></BaseButton>
)
