/** @jsx jsx */
import { css } from "@emotion/core"
import "twin.macro"
import tw from "twin.macro"

export const globalStyle = css`
  body {
    ${tw`text-gray-800`}
    font-family: 'Nunito', sans-serif;
  }
  button {
    font-weight: inherit;
  }
`
