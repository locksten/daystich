/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FocusRing } from "components/FocusRing"
import { FC } from "react"
import "twin.macro"

export type ClickableProps = {
  onClick?: (e: React.MouseEvent) => void
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
    <FocusRing>
      <a
        tw="focus:outline-none"
        onClick={(e) => onClick?.(e)}
        href={link}
        {...props}
      >
        {children}
      </a>
    </FocusRing>
  ) : (
    <FocusRing>
      <button
        tw="focus:outline-none"
        onClick={(e) => onClick?.(e)}
        type={
          type === "submitButton"
            ? "submit"
            : type === "resetButton"
            ? "reset"
            : "button"
        }
        {...props}
      >
        {children}
      </button>
    </FocusRing>
  )
