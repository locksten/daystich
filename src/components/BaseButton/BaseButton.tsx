/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC, ReactNode } from "react"
import tw from "twin.macro"

type BaseButtonProps = CommonButtonProps & {
  leading?: ReactNode
  middle?: ReactNode
  trailing?: ReactNode
}

export type CommonButtonProps = {
  onClick?: () => void
  link?: string
  type?: "link" | "button" | "submitButton" | "resetButton"
}

export const BaseButton: FC<BaseButtonProps> = ({
  type,
  link,
  onClick,
  leading,
  middle,
  trailing,
  ...props
}) => {
  const Container: FC<{}> = ({ children, ...props }) =>
    type === "link" || (type === undefined && link !== undefined) ? (
      <a onClick={() => onClick?.()} href={link} {...props}>
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
        {...props}
      >
        {children}
      </button>
    )

  return (
    <Container css={tw`focus:outline-none focus:shadow-outline`} {...props}>
      <div css={tw`flex justify-center items-center`}>
        {leading}
        {middle}
        {trailing}
      </div>
    </Container>
  )
}
