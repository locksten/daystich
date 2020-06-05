/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { FC } from "react"
import tw from "twin.macro"

type TableProps = {
  header?: React.ReactNode
  footer?: React.ReactNode
  title?: string
  children: React.ReactNode
}

export const Table: FC<TableProps> = ({
  header,
  footer,
  title,
  children,
  ...props
}: TableProps) => (
  <table
    css={css`
      ${tw`w-full text-left`}
      th {
        ${tw`font-bold`}
      }
      th,
      td {
        ${tw`p-1`}
      }
    `}
    {...props}
  >
    {title && (
      <caption tw="py-1 px-2 font-semibold text-xl text-left">{title}</caption>
    )}
    {header && <thead>{header}</thead>}
    <tbody>{children}</tbody>
    {footer && <tfoot>{footer}</tfoot>}
  </table>
)
