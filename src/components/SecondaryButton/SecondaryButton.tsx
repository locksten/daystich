/** @jsx jsx */
import { jsx } from "@emotion/core"
import { BaseButton, CommonButtonProps } from "components/BaseButton"
import { FC } from "react"
import tw from "twin.macro"

type SecondaryButton = CommonButtonProps & { text: string }

export const SecondaryButton: FC<SecondaryButton> = ({ text, ...props }) => (
  <BaseButton
    css={tw`py-2 px-2 rounded-lg font-semibold text-teal-500 bg-gray-200 active:bg-gray-300`}
    middle={text}
    {...props}
  ></BaseButton>
)
