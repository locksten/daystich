/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC, FormEvent } from "react"
import "twin.macro"

export const FormModal: FC<{
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
}> = ({ onSubmit, children, ...props }) => (
  <form
    onSubmit={onSubmit}
    tw="grid gap-2 w-64 rounded-md-4 p-4 bg-white shadow-lg"
    {...props}
  >
    {children}
  </form>
)
