/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC, Fragment } from "react"
import {
  NestedOrderable,
  NestedOrderableNode,
} from "redux/common/nestedOrderable"
import "twin.macro"
import { Single, SingleConfig } from "./Single"
import { useTreeNodeDnd } from "./useTreeNodeDnd"
import { Activity } from "redux/ducks/activity/types"
import { Tag } from "redux/ducks/tag/types"

type Props<T extends NestedOrderable> = {
  nodes: NestedOrderableNode<T>[]
  singleConfig: SingleConfig<T>
}

export const List = <T extends Activity | Tag>({
  nodes,
  singleConfig,
}: Props<T>) => {
  const Node: FC<{ node: NestedOrderableNode<T> }> = ({ node }) => {
    const hasChildren = node.children.length !== 0
    const { dndProps, dndDragHandleProps } = useTreeNodeDnd(
      node.entity,
      "list",
      hasChildren,
    )
    const { dndProps: singleDndProps } = useTreeNodeDnd(node.entity, "single")
    return (
      <div tw="flex flex-col pl-3" {...dndProps}>
        <Single<T>
          node={node}
          isTopLevel={false}
          singleConfig={singleConfig}
          dragHandleProps={dndDragHandleProps}
          dropProps={singleDndProps}
        />
        {hasChildren && (
          <List<T> nodes={node.children} singleConfig={singleConfig} />
        )}
      </div>
    )
  }

  return (
    <Fragment>
      {nodes.map((node) => (
        <Node key={node.entity.id} node={node} />
      ))}
    </Fragment>
  )
}
