/** @jsx jsx */
import { jsx, Global } from "@emotion/core"
import { FC, Fragment } from "react"
import { globalStyle } from "../src/styling/Themes"
import "tailwindcss/dist/base.css"
import "twin.macro"

export const Wrapper: FC<any> = (content) => (
  <Fragment>
    <Global styles={globalStyle} />
    <div tw="p-10">{content}</div>
  </Fragment>
)
