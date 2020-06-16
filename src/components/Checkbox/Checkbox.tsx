/** @jsx jsx */
import { jsx } from "@emotion/core"
import { forwardRef } from "react"
import "twin.macro"

type CheckboxProps = {
  name: string
  label: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ name, label }, ref) => (
    <div tw="flex items-center">
      <label tw="pr-2" htmlFor={name}>
        {label}
      </label>
      <input ref={ref} name={name} type="checkbox" />
    </div>
  ),
)
