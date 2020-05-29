/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC } from "react"
import tw from "twin.macro"

export const {{name}}: FC<{}> = ({ ...props }) => (
  <div
    css={tw`font-bold p-2 border-4 bg-purple-200 border-purple-800`}
    {...props}
  >
    {{name}}
  </div>
)
