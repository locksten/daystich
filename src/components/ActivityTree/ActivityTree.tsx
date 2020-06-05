/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Card } from "Card"
import { FC } from "react"
import "twin.macro"

export const ActivityTree: FC<{ tagID: string }> = ({ tagID }) => {
  return (
    <div tw="grid grid-cols-3 gap-4">
      <Card tw="bg-green-400">
        <div tw="grid">
          <div tw="text-white font-semibold">{tagID}</div>
          <div tw="text-white font-semibold">{tagID}</div>
          <div tw="text-white font-semibold">{tagID}</div>
        </div>
      </Card>
    </div>
  )
}
