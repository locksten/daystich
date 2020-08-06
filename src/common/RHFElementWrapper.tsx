/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC, Ref } from "react"
import { Controller, useFormContext, ValidationRules } from "react-hook-form"

type WrappedComponent<T extends FC> = FC<
  { name: string; rules?: ValidationRules } & Parameters<T>[0]
>

export const RHFElementWrapper = <
  Element extends FC<{ name: string; ref: Ref<any> } & any>
>(
  Element: Element,
) => {
  const Component = Element as FC<{ name: string; ref: any } & any>
  const Wrapped: WrappedComponent<Element> = ({ name, rules, ...props }) => {
    const { register } = useFormContext()
    return <Component name={name} ref={register(rules)} {...props} />
  }
  return Wrapped
}

export const RHFControlledElementWrapper = <
  Value,
  Element extends FC<{ value?: Value; onChange?: (value: Value) => void } & any>
>({
  Element,
  defaultValue,
}: {
  Element: Element
  defaultValue: Value
}) => {
  const Component = Element as FC
  const Wrapped: WrappedComponent<Element> = ({ name, rules, ...props }) => {
    const { control } = useFormContext()
    return (
      <Controller
        as={<Component />}
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        {...props}
      />
    )
  }
  return Wrapped
}
