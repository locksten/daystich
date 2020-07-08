/** @jsx jsx */
import { jsx } from "@emotion/core"
import { forwardRef } from "react"
import "twin.macro"

type CheckboxProps = {
  name: string
  label: string
  checked?: boolean
  defaultChecked?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ name, label, checked, defaultChecked }, ref) => (
    <div tw="flex items-center">
      <label tw="pr-2" htmlFor={name}>
        {label}
      </label>
      <input
        tw="focus:outline-none focus:shadow-outline"
        ref={ref}
        name={name}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
      />
    </div>
  ),
)
