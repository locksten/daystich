import { css } from "@emotion/core"
import tw from "twin.macro"

export const globalStyle = css`
  body {
    ${tw`bg-gray-100 text-gray-800`}
    font-family: 'Nunito', sans-serif;
  }
  button {
    font-weight: inherit;
  }
`
