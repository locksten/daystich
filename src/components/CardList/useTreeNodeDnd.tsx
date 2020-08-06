/** @jsx jsx */
import { useDnd } from "common/useDragAndDrop"
import { useEditMode } from "common/editMode"
import { useSelectActivityUsages } from "redux/ducks/activity"
import { moveActivity, moveTag } from "redux/ducks/shared/actions"
import {
  getTagDescendantIds,
  selectTags,
  TreeNode,
  useSelectTagUsages,
} from "redux/ducks/tag"
import { useAppSelector } from "redux/redux/rootReducer"
import { useAppDispatch } from "redux/redux/store"
import "twin.macro"

export const useTreeNodeDnd = (
  node: TreeNode,
  element: "list" | "single",
  hasChildren?: boolean,
) => {
  const { isEditMode } = useEditMode()
  const dispatch = useAppDispatch()

  const { isInUse: activityIsInUse } = useSelectActivityUsages(
    node.activity?.id,
  )
  const { isInUse: tagIsInUse } = useSelectTagUsages(node.tag.id)

  const tags = useAppSelector(selectTags)

  const { dndDragHandleProps, dndProps } = useDnd<TreeNode>({
    type: node.activity ? "activity" : "tag",
    item: node,
    canDrag: () => isEditMode,
    onDrop: (node, destination, dropSide) => {
      dropSide =
        element === "single"
          ? hasChildren && dropSide === "bot"
            ? "mid"
            : dropSide
          : dropSide === "mid"
          ? "bot"
          : dropSide

      if (dropSide === "mid" && node.tag.id === destination.tag.id) return

      const newParentId =
        dropSide === "mid" ? destination.tag.id : destination.tag.parentTagId

      const descendants = getTagDescendantIds(tags, node.tag.id)
      if (newParentId && descendants.includes(newParentId)) return

      const destinationOrdering =
        destination.mainListOrdering ?? destination.tag.ordering

      const newPosition =
        dropSide === "top"
          ? destinationOrdering
          : dropSide === "bot"
          ? destinationOrdering + 1
          : undefined

      dispatch(
        node.activity
          ? moveActivity({
              id: node.tag.id,
              newParentId,
              newParentIsTopLevel: destination.mainListOrdering !== undefined,
              newPosition,
              isInUse: dropSide === "mid" && activityIsInUse,
            })
          : moveTag({
              id: node.tag.id,
              newParentId,
              newPosition,
              newParentIsTopLevel: destination.mainListOrdering !== undefined,
              isInUse: dropSide === "mid" && tagIsInUse,
            }),
      )
    },
  })

  return {
    dndDragHandleProps,
    dndProps,
  }
}
