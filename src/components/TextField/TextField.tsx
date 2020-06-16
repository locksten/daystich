/** @jsx jsx */
import { jsx } from "@emotion/core"
import "twin.macro"
import { forwardRef } from "react"

type TextFieldProps = {
  name: string
  label: string
  autocomplete?: boolean
  type?: string
  value?: string
  defaultValue?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    { name, label, type = "text", autocomplete = false, value, defaultValue },
    ref,
  ) => (
    <div tw="grid">
      <label tw="font-light text-sm" htmlFor={name}>
        {label}
      </label>
      <input
        tw="bg-gray-200 rounded-md shadow-inner p-2 py-1 focus:outline-none focus:shadow-outline"
        name={name}
        ref={ref}
        type={type}
        value={value}
        defaultValue={defaultValue}
        autoComplete={autocomplete ? "on" : "off"}
      />
    </div>
  ),
)
