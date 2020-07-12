/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Card } from "components/Card"
import { Clickable } from "components/Clickable"
import { useTopLevelReturnDetachModal } from "components/modals/TopLevelReturnDetachModal"
import { isRootActivityId } from "redux/common"
import { useAppSelector } from "redux/redux/rootReducer"
import { selectTagById, selectTagColor, TreeNode } from "redux/ducks/tag"
import { useEditMode } from "hooks/editMode"
import { FC, Fragment } from "react"
import "twin.macro"
import { List } from "./List"
import { Single, SingleConfig } from "./Single"
import { useTreeNodeDnd } from "./useTreeNodeDnd"

const TopLevelIndicator: FC<{ node: TreeNode }> = ({ node }) => {
  const { editMode } = useEditMode()
  const isNaturallyTopLevel =
    isRootActivityId(node.tag.parentTagId) || node.tag.parentTagId === undefined
  const parent = useAppSelector((s) =>
    selectTagById(s, node.tag?.parentTagId ?? ""),
  )
  const modal = useTopLevelReturnDetachModal()({ id: node.tag.id })

  return (
    <Fragment>
      {editMode && !isNaturallyTopLevel && (
        <div tw="flex">
          <Clickable tw="text-white text-sm" onClick={modal.open}>
            {parent!.name}
          </Clickable>
        </div>
      )}
      <modal.Modal />
    </Fragment>
  )
}

export const ListCard: FC<{
  node: TreeNode
  singleConfig: SingleConfig
}> = ({ node, singleConfig }) => {
  const color = useAppSelector((s) => selectTagColor(s, node.tag.id))
  const hasChildren = node.children.length !== 0

  const {
    dndProps: { ref: dndRef, ...dndProps },
    dndDragHandleProps,
  } = useTreeNodeDnd(node, "list", hasChildren)
  const { dndProps: singleDndProps } = useTreeNodeDnd(node, "single")

  return (
    <div tw="pb-4" ref={dndRef} {...dndProps}>
      <Card
        css={css`
          background-color: ${color};
        `}
      >
        <div tw="flex flex-col leading-none pl-1">
          <TopLevelIndicator node={node} />
          <Single
            node={node}
            isTopLevel={true}
            singleConfig={singleConfig}
            dragHandleProps={dndDragHandleProps}
            dropProps={singleDndProps}
          />
          {hasChildren && (
            <List nodes={node.children} singleConfig={singleConfig} />
          )}
        </div>
      </Card>
    </div>
  )
}
