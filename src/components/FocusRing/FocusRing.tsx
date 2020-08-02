/** @jsx jsx */
import { ClassNames, jsx } from "@emotion/core"
import { FocusRing as AriaFocusRing } from "@react-aria/focus"
import { FC, ReactElement } from "react"
import "twin.macro"

export const FocusRing: FC<{
  children: ReactElement
  alwaysShow?: boolean
}> = ({ children, alwaysShow }) => (
  <ClassNames>
    {({ css }) => {
      return (
        <AriaFocusRing
          focusClass={css`
            ${alwaysShow &&
            css`
              box-shadow: inset 0 0 0 3px rgba(66, 153, 225, 0.5);
            `}
          `}
          focusRingClass={css`
            box-shadow: inset 0 0 0 3px rgba(66, 153, 225, 0.5);
          `}
        >
          {children}
        </AriaFocusRing>
      )
    }}
  </ClassNames>
)
