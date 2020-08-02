/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Id } from "common"
import { Clickable } from "components/Clickable"
import { TreeNode } from "redux/ducks/tag"
import { useEditMode } from "hooks/editMode"
import { FC } from "react"
import "twin.macro"
import tw from "twin.macro"

export type SingleConfig = {
  onLeafClick?: (node: TreeNode) => void
  RenderSide?: FC<{
    id: Id
  }>
}

export const Single: FC<{
  node: TreeNode
  isTopLevel: boolean
  singleConfig: SingleConfig
  dragHandleProps?: object
  dropProps?: object
}> = ({
  node,
  singleConfig: { onLeafClick, RenderSide },
  isTopLevel,
  dragHandleProps,
  dropProps,
}) => {
  const { editMode } = useEditMode()
  const isLeaf = node.children.length === 0

  const Name: FC<{}> = ({ children, ...props }) =>
    editMode ? (
      <div {...props}>{children}</div>
    ) : isLeaf && !node.hasTopLevelChildren ? (
      <Clickable onClick={() => onLeafClick?.(node)} {...props}>
        {children}
      </Clickable>
    ) : (
      <div tw="cursor-default" {...props}>
        {children}
      </div>
    )

  const Side: FC<{}> = () => (
    <div tw="h-full flex items-center px-1">
      {RenderSide && <RenderSide id={node.tag.id} />}
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
          ${!isTopLevel && !isLeaf && tw`text-lg font-semibold`};
          ${!isTopLevel &&
          isLeaf &&
          !node.hasTopLevelChildren &&
          css`
            ${tw`text-lg font-semibold`};
            &:hover {
              background-color: rgba(0, 0, 0, 0.05);
            }
          `};
        `}
        {...dragHandleProps}
      >
        <Name tw="h-full w-full text-left min-w-0 truncate">{`${node.tag.name}`}</Name>
        <Side />
      </div>
    </div>
  )
}
