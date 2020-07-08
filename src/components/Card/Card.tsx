/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC } from "react"
import "twin.macro"

export const Card: FC<{ innerRef?: any }> = ({ innerRef, ...props }) => (
  <div tw="p-4 rounded-md-4 bg-white shadow-lg" ref={innerRef} {...props}></div>
)
