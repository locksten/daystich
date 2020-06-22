/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Id } from "common"
import { Card } from "components/Card"
import { Table } from "components/Table"
import { useAppSelector } from "ducks/redux/rootReducer"
import { selectTags } from "ducks/tag"
import { FC } from "react"
import "twin.macro"

type Inputs = {
  name: string
  parentTagId: Id
}

export const TagTable: FC<{}> = () => {
  const tags = useAppSelector(selectTags)

  return (
    <Card tw="grid gap-2">
      <Table
        header={
          <tr>
            <th>Id</th>
            <th>parentTag</th>
            <th>name</th>
          </tr>
        }
      >
        {tags.map((t) => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{tags.find((tag) => tag.id === t.parentTagId)?.name}</td>
            <td>{t.name}</td>
          </tr>
        ))}
      </Table>
    </Card>
  )
}
