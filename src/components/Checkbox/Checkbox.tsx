/** @jsx jsx */
import { jsx } from "@emotion/core"
import { RHFElementWrapper } from "hooks/RHFElementWrapper"
import { FocusRing } from "components/FocusRing"
import { forwardRef } from "react"
import "twin.macro"

export const Checkbox = forwardRef<
  HTMLInputElement,
  {
    name: string
    label: string
    checked?: boolean
    defaultChecked?: boolean
  }
>(({ name, label, checked, defaultChecked }, ref) => (
  <div tw="flex items-center">
    <label tw="pr-2" htmlFor={name}>
      {label}
    </label>
    <FocusRing>
      <input
        tw="focus:outline-none"
        ref={ref}
        name={name}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
      />
    </FocusRing>
  </div>
))

export const RHFCheckbox = RHFElementWrapper(Checkbox)
