/** @jsx jsx */
import { jsx } from "@emotion/core"
import tw from "twin.macro"
import { forwardRef } from "react"

type InputProps = {
  name: string
  label: string
  autocomplete?: boolean
  type?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, label, type = "text", autocomplete = false }, ref) => (
    <div css={tw`grid`}>
      <label css={tw`font-light text-sm`} htmlFor={name}>
        {label}
      </label>
      <input
        css={tw`bg-gray-200 rounded-md p-2 py-1 focus:outline-none focus:shadow-outline`}
        name={name}
        ref={ref}
        type={type}
        autoComplete={autocomplete ? "on" : "off"}
      />
    </div>
  ),
)
