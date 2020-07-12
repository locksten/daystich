/** @jsx jsx */
import { jsx } from "@emotion/core"
import { TreeNode } from "redux/ducks/tag"
import { FC, Fragment } from "react"
import "twin.macro"
import { Single, SingleConfig } from "./Single"
import { useTreeNodeDnd } from "./useTreeNodeDnd"

export const List: FC<{
  nodes: TreeNode[]
  singleConfig: SingleConfig
}> = ({ nodes, singleConfig }) => {
  const Node: FC<{ node: TreeNode }> = ({ node }) => {
    const hasChildren = node.children.length !== 0
    const { dndProps, dndDragHandleProps } = useTreeNodeDnd(
      node,
      "list",
      hasChildren,
    )
    const { dndProps: singleDndProps } = useTreeNodeDnd(node, "single")
    return (
      <div tw="flex flex-col pl-3" {...dndProps}>
        <Single
          node={node}
          isTopLevel={false}
          singleConfig={singleConfig}
          dragHandleProps={dndDragHandleProps}
          dropProps={singleDndProps}
        />
        {hasChildren && (
          <List nodes={node.children} singleConfig={singleConfig} />
        )}
      </div>
    )
  }

  return (
    <Fragment>
      {nodes.map((node) => (
        <Node key={node.tag.id} node={node} />
      ))}
    </Fragment>
  )
}
