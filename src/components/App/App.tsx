/** @jsx jsx */
import { Global, jsx } from "@emotion/core"
import { ActivityTree } from "components/ActivityTree"
import { FC } from "react"
import { globalStyle } from "styling/Themes"
import "tailwindcss/dist/base.css"
import "twin.macro"
import { Table } from "components/Table"
import { Card } from "Card"
import { PrimaryButton } from "components/PrimaryButton"

export const App: FC = () => {
  return (
    <div tw="grid gap-8 p-8">
      <Global styles={globalStyle} />
      <Card tw="grid gap-2">
        <Table
          header={
            <tr>
              <th>Header A</th>
              <th>Header B</th>
              <th>Header C</th>
            </tr>
          }
        >
          <tr>
            <td>abc</td>
            <td>123</td>
            <td>2h 20m</td>
          </tr>
          <tr>
            <td>abc</td>
            <td>123</td>
            <td>2h 20m</td>
          </tr>
        </Table>
        <PrimaryButton text="button" />
      </Card>
      <ActivityTree tagID="tagID" />
    </div>
  )
}

export default App
