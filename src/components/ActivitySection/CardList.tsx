/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Id } from "common"
import { applyFilters, Filters } from "components/ActivitySection/filters"
import { Card } from "components/Card"
import { Clickable } from "components/Clickable"
import { IconButton } from "components/IconButton"
import { useAddActivityModal } from "components/modals/AddActivityModal"
import { useAddTagModal } from "components/modals/AddTagModal"
import { useEditActivityModal } from "components/modals/EditActivityModal"
import { useEditTagModal } from "components/modals/EditTagModal"
import { ModalHookReturnType } from "components/modals/Modal"
import { useAppSelector } from "ducks/redux/rootReducer"
import { useAppDispatch } from "ducks/redux/store"
import {
  selectDisplayTopLevelActivityTreeList,
  selectTagTreeList,
  selectTopLevelDisplayTagTreeList,
} from "ducks/selectors"
import { selectTagColor, TreeNode } from "ducks/tag"
import { addTimeSpanNow } from "ducks/timeSpan"
import { useEditMode } from "hooks/editMode"
import { FC, Fragment } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import "twin.macro"
import tw from "twin.macro"

type CardListConfig = {
  singleColumn?: boolean
  filters?: Filters
}

const CardList: FC<{
  nodes: TreeNode[]
  config: CardListConfig
  singleConfig: SingleConfig
}> = ({ nodes, config: { filters }, singleConfig, ...props }) => {
  const filteredNodes = filters ? applyFilters(nodes, filters) : nodes
  return (
    <DragDropContext
      onDragEnd={(e) =>
        console.log(
          `drop ${e.draggableId} at ${e.destination?.index} in ${e.destination?.droppableId}`,
        )
      }
    >
      <Droppable droppableId={"CardLists"}>
        {(provided) => (
          <div tw="flex justify-center">
            <div
              tw="grid gap-4 max-w-lg w-full"
              {...props}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredNodes.map((n) => (
                <div key={n.tag.id}>
                  <ListCard node={n} singleConfig={singleConfig} />
                </div>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export const TagCardList: FC<{
  config?: CardListConfig
  singleConfig?: SingleConfig
  id?: Id
}> = ({ config, singleConfig, id, ...props }) => {
  const { editMode } = useEditMode()

  const TagSide = undefined

  const TagEditSide: FC<{ id: Id }> = ({ id }) => {
    const add = useAddTagModal()({ parentTagId: id })
    const edit = useEditTagModal()({ id })
    return <EditSide addModal={add} editModal={edit} />
  }

  const defaultSingleConfig: Partial<SingleConfig> = {
    RenderSide: editMode ? TagEditSide : TagSide,
  }

  const nodes = useAppSelector((s) =>
    id ? selectTagTreeList(s, id) : selectTopLevelDisplayTagTreeList(s),
  )

  return (
    <CardList
      nodes={nodes}
      config={config ?? {}}
      singleConfig={{ ...defaultSingleConfig, ...singleConfig }}
      {...props}
    />
  )
}

export const ActivityCardList: FC<{
  config?: CardListConfig
  singleConfig?: SingleConfig
}> = ({ config, singleConfig, ...props }) => {
  const dispatch = useAppDispatch()

  const { editMode } = useEditMode()

  const ActivitySide = undefined

  const ActivityEditSide: FC<{ id: Id }> = ({ id }) => {
    const add = useAddActivityModal()({ parentTagId: id })
    const edit = useEditActivityModal()({ id })
    return <EditSide addModal={add} editModal={edit} />
  }

  const defaultSingleConfig: Partial<SingleConfig> = {
    RenderSide: editMode ? ActivityEditSide : ActivitySide,
    onLeafClick: ({ activity }) =>
      dispatch(addTimeSpanNow({ activityId: activity!.id })),
  }

  const nodes = useAppSelector(selectDisplayTopLevelActivityTreeList)

  return (
    <CardList
      nodes={nodes}
      config={config ?? {}}
      singleConfig={{ ...defaultSingleConfig, ...singleConfig }}
      {...props}
    />
  )
}

const ListCard: FC<{
  node: TreeNode
  singleConfig: SingleConfig
}> = ({ node, singleConfig }) => {
  const { editMode } = useEditMode()
  const color = useAppSelector((s) => selectTagColor(s, node.tag.id))
  return (
    <Draggable
      draggableId={node.tag.id}
      index={node.tag.ordering}
      isDragDisabled={!editMode}
    >
      {(provided) => (
        <Card
          css={{ backgroundColor: color }}
          innerRef={provided.innerRef}
          {...provided.draggableProps}
        >
          <div tw="leading-none pl-1 grid gap-1">
            <Single
              node={node}
              isTopLevel={true}
              singleConfig={singleConfig}
              {...provided.dragHandleProps}
            />
            {node.children.length !== 0 && (
              <List nodes={node.children} singleConfig={singleConfig} />
            )}
          </div>
        </Card>
      )}
    </Draggable>
  )
}

const List: FC<{
  nodes: TreeNode[]
  singleConfig: SingleConfig
}> = ({ nodes, singleConfig }) => {
  return (
    <div tw="grid gap-1">
      {nodes.map((node) => (
        <div key={node.tag.id} tw="pl-3 grid gap-1">
          <Single node={node} isTopLevel={false} singleConfig={singleConfig} />
          {node.children.length !== 0 && (
            <List nodes={node.children} singleConfig={singleConfig} />
          )}
        </div>
      ))}
    </div>
  )
}

type SingleConfig = {
  onLeafClick?: (node: TreeNode) => void
  RenderSide?: FC<{
    id: Id
  }>
}

const Single: FC<{
  node: TreeNode
  isTopLevel: boolean
  singleConfig: SingleConfig
}> = ({
  node,
  singleConfig: { onLeafClick, RenderSide },
  isTopLevel,
  ...props
}) => {
  const { editMode } = useEditMode()

  const isLeaf = node.children.length === 0

  const Name: FC<{}> = ({ children, ...props }) =>
    editMode ? (
      <div {...props}>{children}</div>
    ) : isLeaf ? (
      <Clickable onClick={() => onLeafClick?.(node)} {...props}>
        {children}
      </Clickable>
    ) : (
      <div tw="cursor-default" {...props}>
        {children}
      </div>
    )

  const Side: FC<{}> = () => (
    <div tw="flex items-center px-1">
      {RenderSide && <RenderSide id={node.tag.id} />}
    </div>
  )

  return (
    <div
      css={css`
        ${tw`h-5 flex justify-between items-center -ml-1 pl-1 rounded-md text-white overflow-hidden`};
        ${isTopLevel && tw`text-xl font-extrabold`};
        ${!isTopLevel && !isLeaf && tw`text-lg font-semibold`};
        ${!isTopLevel &&
        isLeaf &&
        css`
          ${tw`text-lg font-semibold`};
          &:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
        `};
      `}
      {...props}
    >
      <Name tw="w-full text-left min-w-0 truncate">{`${node.tag.ordering}. ${node.tag.name}`}</Name>
      <Side />
    </div>
  )
}

export const EditSide: FC<{
  addModal: ModalHookReturnType
  editModal: ModalHookReturnType
}> = ({ addModal, editModal }) => {
  return (
    <Fragment>
      <div tw="grid grid-flow-col gap-1">
        <IconButton
          tw="opacity-75 hover:opacity-100"
          onClick={editModal.open}
          icon="edit"
        />
        <IconButton
          tw="opacity-75 hover:opacity-100"
          onClick={addModal.open}
          icon="add"
        />
      </div>
      <addModal.Modal />
      <editModal.Modal />
    </Fragment>
  )
}
