/** @jsx jsx */
import { useDnd } from "common/useDragAndDrop"
import { moveActivity } from "redux/ducks/activity/activity"
import { useAppDispatch } from "redux/redux/store"
import "twin.macro"
import { moveTag } from "redux/ducks/tag/tag"
import { Activity, ActivityId } from "redux/ducks/activity/types"
import { Tag, TagId } from "redux/ducks/tag/types"

export const useTreeNodeDnd = (
  entity: Activity | Tag,
  element: "list" | "single",
  hasChildren?: boolean,
) => {
  const dispatch = useAppDispatch()

  const { dndDragHandleProps, dndProps } = useDnd<Activity | Tag>({
    type: entity._type,
    item: entity,
    canDrag: () => true,
    onDrop: (entity, destination, _dropSideX, dropSideY) => {
      dropSideY =
        element === "single"
          ? hasChildren && dropSideY === "bot"
            ? "mid"
            : dropSideY
          : dropSideY === "mid"
          ? "bot"
          : dropSideY

      const newParentId =
        dropSideY === "mid" ? destination.id : destination.parentId

      if (entity.id === newParentId) return

      const adjustOrderingByDropSide = (ordering?: number) =>
        ordering === undefined
          ? -1
          : dropSideY === "top"
          ? ordering
          : dropSideY === "bot"
          ? ordering + 1
          : -1

      const newOrdering =
        newParentId === undefined
          ? {
              topLevelOrdering: adjustOrderingByDropSide(
                destination.topLevelOrdering,
              ),
            }
          : {
              ordering: adjustOrderingByDropSide(destination.ordering),
            }

      if (entity._type === "activity" && destination._type === "activity") {
        dispatch(
          moveActivity({
            id: entity.id,
            to: {
              parentId: newParentId as ActivityId,
              ...newOrdering,
            },
          }),
        )
      } else if (entity._type === "tag" && destination._type === "tag") {
        dispatch(
          moveTag({
            id: entity.id,
            to: {
              parentId: newParentId as TagId,
              ...newOrdering,
            },
          }),
        )
      }
    },
  })

  return {
    dndDragHandleProps,
    dndProps,
  }
}
