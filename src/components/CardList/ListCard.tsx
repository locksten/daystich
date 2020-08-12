/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { useEditMode } from "common/editMode"
import { Card } from "components/Card"
import { Clickable } from "components/Clickable"
import { useTopLevelReturnDetachModal } from "components/modals/TopLevelActagReturnOrDetachModal"
import { Fragment } from "react"
import {
  NestedOrderableNode,
  NestedOrderable,
} from "redux/common/nestedOrderable"
import {
  selectActivityById,
  selectActivityColor,
} from "redux/ducks/activity/selectors"
import { useAppSelector } from "redux/redux/rootReducer"
import "twin.macro"
import { List } from "./List"
import { Single, SingleConfig } from "./Single"
import { useTreeNodeDnd } from "./useTreeNodeDnd"
import { Activity } from "redux/ducks/activity/types"
import { Tag } from "redux/ducks/tag/types"
import { selectTagById, selectTagColor } from "redux/ducks/tag/selectors"

const TopLevelIndicator = ({
  node: { entity },
}: {
  node: NestedOrderableNode<Activity | Tag>
}) => {
  const { isEditMode } = useEditMode()
  const parent = useAppSelector((s) =>
    entity._type === "activity"
      ? selectActivityById(s, entity?.parentId)
      : selectTagById(s, entity?.parentId),
  )
  const modal = useTopLevelReturnDetachModal()({ entity })

  return (
    <Fragment>
      {isEditMode && parent !== undefined && (
        <div tw="flex">
          <Clickable tw="text-white text-sm" onClick={modal.open}>
            {parent.name}
          </Clickable>
        </div>
      )}
      <modal.Modal />
    </Fragment>
  )
}

type Props<T extends NestedOrderable> = {
  node: NestedOrderableNode<T>
  singleConfig: SingleConfig<T>
}

export const ListCard = <T extends Activity | Tag>({
  node,
  singleConfig,
}: Props<T>) => {
  const color = useAppSelector(
    node.entity._type === "activity"
      ? (s) => selectActivityColor(s, node.entity.id)
      : (s) => selectTagColor(s, node.entity.id),
  )
  const hasChildren = node.children.length !== 0

  const {
    dndProps: { ref: dndRef, ...dndProps },
    dndDragHandleProps,
  } = useTreeNodeDnd(node.entity, "list", hasChildren)
  const { dndProps: singleDndProps } = useTreeNodeDnd(node.entity, "single")

  return (
    <div tw="pb-4" ref={dndRef} {...dndProps}>
      <Card
        css={css`
          background-color: ${color};
        `}
      >
        <div tw="flex flex-col leading-none pl-1">
          <TopLevelIndicator node={node} />
          <Single<T>
            node={node}
            isTopLevel={true}
            singleConfig={singleConfig}
            dragHandleProps={dndDragHandleProps}
            dropProps={singleDndProps}
          />
          {hasChildren && (
            <List<T> nodes={node.children} singleConfig={singleConfig} />
          )}
        </div>
      </Card>
    </div>
  )
}
