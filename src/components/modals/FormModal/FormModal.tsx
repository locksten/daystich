/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC } from "react"
import "twin.macro"

export const FormModal: FC = ({ children, ...props }) => (
  <div tw="w-64 rounded-md-4 p-4 bg-white shadow-lg" {...props}>
    {children}
  </div>
)
