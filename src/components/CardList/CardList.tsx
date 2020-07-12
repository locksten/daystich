/** @jsx jsx */
import { jsx } from "@emotion/core"
import { applyFilters, Filters } from "components/CardList/filters"
import { TreeNode } from "redux/ducks/tag"
import { FC } from "react"
import "twin.macro"
import { ListCard } from "./ListCard"
import { SingleConfig } from "./Single"

export type CardListConfig = {
  singleColumn?: boolean
  filters?: Filters
}

export const CardList: FC<{
  nodes: TreeNode[]
  config: CardListConfig
  singleConfig: SingleConfig
}> = ({ nodes, config: { filters }, singleConfig, ...props }) => {
  const filteredNodes = filters ? applyFilters(nodes, filters) : nodes
  return (
    <div tw="flex justify-center">
      <div tw="flex flex-col -mb-4 max-w-lg w-full" {...props}>
        {filteredNodes.map((n) => (
          <div key={n.tag.id}>
            <ListCard node={n} singleConfig={singleConfig} />
          </div>
        ))}
      </div>
    </div>
  )
}
