/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC } from "react"
import "tailwindcss/dist/base.css"
import tw from "twin.macro"

export const Wrapper: FC<any> = (content) => <div css={tw`p-10`}>{content}</div>
