/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC } from "react"
import "twin.macro"

export const Card: FC<{}> = ({ ...props }) => (
  <div tw="p-4 rounded-md-4 bg-white shadow-lg" {...props}></div>
)
