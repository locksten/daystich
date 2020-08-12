/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Filters, applyFilters } from "components/CardList/filters"
import { ListCard } from "components/CardList/ListCard"
import {
  NestedOrderable,
  NestedOrderableNode,
} from "redux/common/nestedOrderable"
import "twin.macro"
import { SingleConfig } from "./Single"
import { Activity } from "redux/ducks/activity/types"
import { Tag } from "redux/ducks/tag/types"

export type CardListConfig = {
  singleColumn?: boolean
  filters?: Filters
}

type Props<T extends NestedOrderable> = {
  nodes: NestedOrderableNode<T>[]
  config: CardListConfig
  singleConfig: SingleConfig<T>
}

export const CardList = <T extends Activity | Tag>({
  nodes,
  config: { filters },
  singleConfig,
  ...props
}: Props<T>) => {
  const filteredNodes = filters ? applyFilters(nodes, filters) : nodes
  return (
    <div tw="flex justify-center">
      <div tw="flex flex-col -mb-4 max-w-lg w-full" {...props}>
        {filteredNodes.map((n) => (
          <div key={n.entity.id}>
            <ListCard<T> node={n} singleConfig={singleConfig} />
          </div>
        ))}
      </div>
    </div>
  )
}
