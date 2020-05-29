/** @jsx jsx */
import { jsx } from "@emotion/core"
import { BaseButton, CommonButtonProps } from "components/BaseButton"
import { FC } from "react"
import tw from "twin.macro"

type PrimaryButtonProps = CommonButtonProps & { text: string }

export const PrimaryButton: FC<PrimaryButtonProps> = ({ text, ...props }) => (
  <BaseButton
    css={tw`py-2 px-2 rounded-lg text-white font-semibold bg-teal-500 active:bg-teal-600 `}
    middle={text}
    {...props}
  ></BaseButton>
)
