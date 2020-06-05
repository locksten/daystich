/** @jsx jsx */
import { jsx } from "@emotion/core"
import { BaseButton, CommonButtonProps } from "components/BaseButton"
import { FC } from "react"
import "twin.macro"

type ClickableProps = CommonButtonProps

export const Clickable: FC<ClickableProps> = ({ children, ...props }) => (
  <BaseButton middle={children} {...props}></BaseButton>
)
