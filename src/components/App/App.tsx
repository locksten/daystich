/** @jsx jsx */
import { Global, jsx } from "@emotion/core"
import { IconButton } from "components/IconButton"
import { Input } from "components/Input"
import { PrimaryButton } from "components/PrimaryButton"
import { SecondaryButton } from "components/SecondaryButton"
import { FC } from "react"
import { globalStyle } from "styling/Themes"
import "tailwindcss/dist/base.css"
import tw from "twin.macro"

export const App: FC = () => {
  return (
    <div css={tw`grid gap-2 p-5`}>
      <Global styles={globalStyle} />
      <div css={tw`text-center`}>HELLO WORLD</div>
      <IconButton css={tw``} icon="emptyStar" />
      <PrimaryButton text="Primary" />
      <SecondaryButton text="Secondary" />
      <Input label="label" name="name" />
    </div>
  )
}

export default App
