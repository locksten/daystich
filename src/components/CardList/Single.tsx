/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { useEditMode } from "common/editMode"
import { Clickable } from "components/Clickable"
import { FC } from "react"
import "twin.macro"
import tw from "twin.macro"
import {
  NestedOrderable,
  NestedOrderableNode,
} from "redux/common/nestedOrderable"
import { Activity } from "redux/ducks/activity/types"
import { Tag } from "redux/ducks/tag/types"

export type SingleConfig<T extends NestedOrderable> = {
  onLeafClick?: (entity: T) => void
  RenderSide?: FC<{
    id: T["id"]
  }>
}

type Props<T extends NestedOrderable> = {
  node: NestedOrderableNode<T>
  isTopLevel: boolean
  singleConfig: SingleConfig<T>
  dragHandleProps?: object
  dropProps?: object
}

export const Single = <T extends Activity | Tag>({
  node,
  singleConfig: { onLeafClick, RenderSide },
  isTopLevel,
  dragHandleProps,
  dropProps,
}: Props<T>) => {
  const { isEditMode } = useEditMode()
  const isLeaf = node.children.length === 0

  const Name: FC = ({ children, ...props }) =>
    isEditMode ? (
      <div {...props}>{children}</div>
    ) : isLeaf && !node.hasChildren ? (
      <Clickable onClick={() => onLeafClick?.(node.entity)} {...props}>
        {children}
      </Clickable>
    ) : (
      <div tw="cursor-default" {...props}>
        {children}
      </div>
    )

  const Side: FC = () => (
    <div tw="h-full flex items-center px-1">
      {RenderSide && <RenderSide id={node.entity.id} />}
    </div>
  )

  return (
    <div
      {...dropProps}
      css={css`
        padding-top: 0.2rem;
      `}
    >
      <div
        css={css`
          ${tw`h-5 flex justify-between items-center -ml-1 pl-1 rounded-md text-white overflow-hidden`};
          ${isTopLevel && tw`text-xl font-extrabold`};
          ${!isTopLevel && tw`text-lg font-semibold`};
          ${!node.hasChildren &&
          css`
            &:hover {
              background-color: rgba(0, 0, 0, 0.05);
            }
          `};
        `}
        {...dragHandleProps}
      >
        <Name tw="h-full w-full text-left min-w-0 truncate box-border">
          {node.entity.name}
        </Name>
        <Side />
      </div>
    </div>
  )
}
