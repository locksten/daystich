/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC } from "react"
import "twin.macro"

export type ClickableProps = {
  onClick?: () => void
  link?: string
  type?: "link" | "button" | "submitButton" | "resetButton"
}

export const Clickable: FC<ClickableProps> = ({
  type,
  link,
  onClick,
  children,
  ...props
}) =>
  type === "link" || (type === undefined && link !== undefined) ? (
    <a
      onClick={() => onClick?.()}
      href={link}
      tw="focus:outline-none focus:shadow-outline"
      {...props}
    >
      {children}
    </a>
  ) : (
    <button
      onClick={() => onClick?.() /* +route */}
      type={
        type === "submitButton"
          ? "submit"
          : type === "resetButton"
          ? "reset"
          : "button"
      }
      tw="focus:outline-none focus:shadow-outline"
      {...props}
    >
      {children}
    </button>
  )
