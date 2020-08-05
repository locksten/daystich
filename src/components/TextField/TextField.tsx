/** @jsx jsx */
import { jsx } from "@emotion/core"
import { RHFElementWrapper } from "hooks/RHFElementWrapper"
import { FocusRing } from "components/FocusRing"
import { forwardRef } from "react"
import "twin.macro"

type TextFieldProps = {
  name: string
  label?: string
  autocomplete?: boolean
  type?: string
  value?: string
  onChange?: (text: string) => void
  defaultValue?: string
  placeholder?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      name,
      label,
      type = "text",
      autocomplete = false,
      value,
      defaultValue,
      onChange,
      placeholder,
      ...props
    },
    ref,
  ) => {
    return (
      <div tw="grid">
        {label && (
          <label tw="font-light text-sm" htmlFor={name}>
            {label}
          </label>
        )}
        <FocusRing alwaysShow>
          <input
            onChange={(e) => onChange?.(e.target.value)}
            tw="bg-gray-200 rounded-md shadow-inner p-2 py-1 focus:outline-none"
            name={name}
            ref={ref}
            type={type}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            autoComplete={autocomplete ? "on" : "off"}
            {...props}
          />
        </FocusRing>
      </div>
    )
  },
)

export const RHFTextField = RHFElementWrapper(TextField)
