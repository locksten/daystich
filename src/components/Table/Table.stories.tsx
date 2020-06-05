/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Table } from "components/Table"

export default {
  title: "Tables",
}

export const table = () => (
  <Table
    title="Table"
    header={
      <tr>
        <th>Header A</th>
        <th>Header B</th>
        <th>Header C</th>
        <th>Header D</th>
      </tr>
    }
  >
    <tr>
      <td>abc</td>
      <td>def</td>
      <td>123</td>
      <td>2h 20m</td>
    </tr>
    <tr>
      <td>ghi</td>
      <td>def</td>
      <td>456</td>
      <td>20m</td>
    </tr>
  </Table>
)
