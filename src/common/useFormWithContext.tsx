/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { FieldValues, UseFormOptions } from "react-hook-form/dist/types/form"

export const useFormWithContext = <
  TFieldValues extends FieldValues = FieldValues,
  TContext extends object = object
>(
  onSubmit: (callback: any) => void,
  args?: UseFormOptions<TFieldValues, TContext>,
) => {
  const form = useForm<TFieldValues, TContext>({
    shouldFocusError: true,
    ...args,
  })

  const { current: Form } = useRef<FC>(({ children, ...props }) => {
    return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
          {children}
        </form>
      </FormProvider>
    )
  })

  return { ...form, Form }
}
