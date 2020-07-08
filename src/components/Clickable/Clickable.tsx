/** @jsx jsx */
import { jsx, css } from "@emotion/core"
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
    <a
      onClick={(e) => onClick?.(e)}
      href={link}
      tw="focus:outline-none focus:shadow-outline"
      {...props}
    >
      {children}
    </a>
  ) : (
    <button
      onClick={(e) => onClick?.(e)}
      type={
        type === "submitButton"
          ? "submit"
          : type === "resetButton"
          ? "reset"
          : "button"
      }
      tw="focus:outline-none"
      css={css`
        :focus {
          box-shadow: inset 0 0 0 3px rgba(66, 153, 225, 0.5);
        }
      `}
      {...props}
    >
      {children}
    </button>
  )
