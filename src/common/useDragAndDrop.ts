import { useRef } from "react"
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd"

const DndItemTypes = {
  activity: "activity",
  tag: "tag",
}

type DndDragItem = {
  type: keyof typeof DndItemTypes
}

export type DropSide = "top" | "mid" | "bot"

export const useDnd = <T extends object>({
  type,
  canDrag,
  item,
  onDrop,
}: {
  type: keyof typeof DndItemTypes
  canDrag: () => boolean
  item: T
  onDrop: (
    item: T,
    destination: T,
    dropSideX: "top" | "mid" | "bot", // TODO
    dropSideY: "top" | "mid" | "bot",
  ) => void
}) => {
  type DragItem = DndDragItem & { item: T }

  const dropPreviewRef = useRef<HTMLDivElement>(null)

  const calculateDropSide = (monitor: DropTargetMonitor) => {
    if (!dropPreviewRef.current) return

    const rect = dropPreviewRef.current?.getBoundingClientRect()
    const rectOneThirdHeight = (rect.bottom - rect.top) / 3
    const cursorPos = monitor.getClientOffset()
    const rectTopToCursorY = (cursorPos as XYCoord).y - rect.top

    return rectTopToCursorY < rectOneThirdHeight
      ? "top"
      : rectTopToCursorY > rectOneThirdHeight * 2
      ? "bot"
      : "mid"
  }

  const [, drag, preview] = useDrag({
    item: { type, item } as DragItem,
    canDrag,
  })

  const [, drop] = useDrop({
    accept: type,
    drop(dragItem: DragItem, monitor) {
      if (monitor.didDrop()) return
      onDrop(
        dragItem.item,
        item,
        calculateDropSide(monitor)!,
        calculateDropSide(monitor)!,
      )
      return dragItem
    },
  })

  drop(preview(dropPreviewRef))

  return {
    dndProps: { ref: dropPreviewRef },
    dndDragHandleProps: { ref: drag },
  }
}
