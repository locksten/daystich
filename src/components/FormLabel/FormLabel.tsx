/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC, ReactNode } from "react"
import "twin.macro"

export const FormLabel: FC<{
  label: string
  name: string
  children: ReactNode
}> = ({ label, name, children }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      {children}
    </div>
  )
}
