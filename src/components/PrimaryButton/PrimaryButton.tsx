/** @jsx jsx */
import { jsx } from "@emotion/core"
import { BaseButton, CommonButtonProps } from "components/BaseButton"
import { FC } from "react"
import "twin.macro"

type PrimaryButtonProps = CommonButtonProps & { text: string }

export const PrimaryButton: FC<PrimaryButtonProps> = ({ text, ...props }) => (
  <BaseButton
    tw="py-1 px-2 rounded-md text-white font-semibold bg-teal-500 active:bg-teal-600"
    middle={text}
    {...props}
  ></BaseButton>
)
