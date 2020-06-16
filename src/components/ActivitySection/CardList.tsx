/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Color, Id } from "common"
import { useAddActivityModal } from "components/AddActivityModal"
import { useAddTagModal } from "components/AddTagModal"
import { Card } from "components/Card"
import { Clickable } from "components/Clickable"
import { useEditTagModal } from "components/EditTagModal"
import { SecondaryButton } from "components/SecondaryButton"
import {
  selectActivityById,
  selectDisplayActivityChildrenIds,
  selectTopLevelDisplayActivityIds,
} from "ducks/activity"
import { rootActivityId } from "ducks/redux/common"
import { useAppSelector } from "ducks/redux/rootReducer"
import { useAppDispatch } from "ducks/redux/store"
import { selectTagById, selectTagChildrenIds, selectTagColor } from "ducks/tag"
import { addTimeSpanNow } from "ducks/timeSpan"
import { FC, Fragment, ReactNode } from "react"
import "twin.macro"
import tw from "twin.macro"
import { useEditActivityModal } from "components/EditActivityModal"

const CardList: FC<{
  ids: Id[]
  RenderCard: FC<{ id: Id }>
  openModal: () => void
  RenderModal: FC<{}>
}> = ({ ids, RenderCard, openModal, RenderModal }) => {
  return (
    <Fragment>
      <div tw="grid grid-cols-3 gap-4">
        {ids.map((id) => (
          <div key={id}>
            <RenderCard id={id} />
          </div>
        ))}
        <SecondaryButton text="Add" onClick={openModal} />
      </div>
      <RenderModal />
    </Fragment>
  )
}

export const TagCardList: FC<{ id: Id }> = ({ id }) => {
  const ids = useAppSelector((s) => selectTagChildrenIds(s, id))
  const { Modal, openModal } = useAddTagModal(id)
  return (
    <CardList
      RenderCard={TagListCard}
      ids={ids}
      openModal={openModal}
      RenderModal={Modal}
    />
  )
}

export const ActivityCardList: FC<{}> = () => {
  const ids = useAppSelector(selectTopLevelDisplayActivityIds)
  const { Modal, openModal } = useAddActivityModal(rootActivityId)
  return (
    <CardList
      RenderCard={ActivityListCard}
      ids={ids}
      openModal={openModal}
      RenderModal={Modal}
    />
  )
}

// ================================================

const ListCard: FC<{
  RenderSingle: ReactNode
  RenderList: ReactNode
  color: Color
}> = ({ RenderSingle, RenderList, color }) => {
  return (
    <Card css={{ backgroundColor: color }}>
      <div tw="leading-none pl-1 grid gap-1">
        {RenderSingle}
        {RenderList}
      </div>
    </Card>
  )
}

const TagListCard: FC<{ id: Id }> = ({ id }) => {
  const color = useAppSelector((s) => selectTagColor(s, id))
  return (
    <ListCard
      RenderSingle={<SingleTag id={id} topLevel={true} />}
      RenderList={<TagList id={id} />}
      color={color}
    />
  )
}

const ActivityListCard: FC<{ id: Id }> = ({ id }) => {
  const activity = useAppSelector((s) => selectActivityById(s, id))!
  const tag = useAppSelector((s) => selectTagById(s, activity.id))!
  const color = useAppSelector((s) => selectTagColor(s, tag.id))

  return (
    <ListCard
      RenderSingle={<SingleActivity id={id} topLevel={true} />}
      RenderList={<ActivityList id={id} />}
      color={color}
    />
  )
}

// ================================================

const List: FC<{
  ids: Id[]
  RenderList: FC<{ id: Id }>
  RenderSingle: FC<{ id: Id }>
}> = ({ ids, RenderList, RenderSingle }) => {
  return (
    <Fragment>
      {ids.length !== 0 && (
        <div tw="grid gap-1">
          {ids.map((id) => (
            <div key={id} tw="pl-3 grid gap-1">
              <RenderSingle id={id} />
              <RenderList id={id} />
            </div>
          ))}
        </div>
      )}
    </Fragment>
  )
}

const TagList: FC<{ id: string }> = ({ id }) => {
  const childrenTagIds = useAppSelector((s) => selectTagChildrenIds(s, id))
  return (
    <List
      ids={childrenTagIds}
      RenderSingle={({ id }) => <SingleTag id={id} />}
      RenderList={({ id }) => <TagList id={id} />}
    />
  )
}

const ActivityList: FC<{ id: Id }> = ({ id }) => {
  const ids = useAppSelector((s) => selectDisplayActivityChildrenIds(s, id))
  return (
    <List
      ids={ids}
      RenderSingle={({ id }) => <SingleActivity id={id} />}
      RenderList={({ id }) => <ActivityList id={id} />}
    />
  )
}

// ================================================

const Single: FC<{
  name: string
  isTopLevel: boolean
  isLeaf: boolean
  onNameClick: () => void
  RenderSide: ReactNode
}> = ({ isTopLevel, isLeaf, name, onNameClick, RenderSide }) => {
  const Name: FC<{}> = ({ children, ...props }) =>
    isLeaf ? (
      <Clickable onClick={onNameClick} {...props}>
        {children}
      </Clickable>
    ) : (
      <div tw="cursor-default" {...props}>
        {children}
      </div>
    )

  const Side: FC<{}> = () => <div tw="flex items-center px-1">{RenderSide}</div>

  return (
    <Fragment>
      <div
        css={css`
          ${tw`h-5 flex justify-between items-center -ml-1 pl-1 rounded-md text-white`};
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
      >
        <Name tw="flex-grow flex justify-between">{name}</Name>
        <Side />
      </div>
    </Fragment>
  )
}

const SingleActivity: FC<{ id: Id; topLevel?: boolean }> = ({
  id,
  topLevel = false,
}) => {
  const activity = useAppSelector((s) => selectActivityById(s, id))!
  const tag = useAppSelector((s) => selectTagById(s, activity.id))!
  const isLeaf =
    useAppSelector((s) => selectTagChildrenIds(s, tag.id)).length === 0

  const dispatch = useAppDispatch()

  const { Modal: AddModal, openModal: openAddModal } = useAddActivityModal(
    tag.id,
  )
  const { Modal: EditModal, openModal: openEditModal } = useEditActivityModal(
    tag.id,
  )

  const TopLevelNote: FC<{}> = () => {
    const ParentTagName: FC<{ parentTagId: Id }> = ({ parentTagId }) => {
      const parentTag = useAppSelector((s) => selectTagById(s, parentTagId))!
      return <Fragment>{parentTag.name}</Fragment>
    }
    return (
      <Fragment>
        {activity.displayAtTopLevel && (
          <div tw="text-white text-xs font-light py-1">
            {tag.parentTagId && <ParentTagName parentTagId={tag.parentTagId} />}
          </div>
        )}
      </Fragment>
    )
  }

  const Side = (
    <Fragment>
      <SideAddButton onClick={openAddModal} />
      <SideEditButton onClick={openEditModal} />
    </Fragment>
  )

  return (
    <Fragment>
      <div>
        <TopLevelNote />
        <Single
          isTopLevel={topLevel}
          isLeaf={isLeaf}
          name={tag.name}
          onNameClick={() =>
            dispatch(addTimeSpanNow({ activityId: tag.id, tagIds: [] }))
          }
          RenderSide={Side}
        />
      </div>
      <AddModal />
      <EditModal />
    </Fragment>
  )
}

export const SingleTag: FC<{ id: Id; topLevel?: boolean }> = ({
  id: tagId,
  topLevel = false,
}) => {
  const tag = useAppSelector((s) => selectTagById(s, tagId))!
  const isLeaf =
    useAppSelector((s) => selectTagChildrenIds(s, tagId)).length === 0

  const { Modal: AddModal, openModal: openAddModal } = useAddTagModal(tag.id)
  const { Modal: EditModal, openModal: openEditModal } = useEditTagModal(tag.id)

  const Side = (
    <Fragment>
      <SideAddButton onClick={openAddModal} />
      <SideEditButton onClick={openEditModal} />
    </Fragment>
  )

  return (
    <Fragment>
      <Single
        isTopLevel={topLevel}
        isLeaf={isLeaf}
        name={tag.name}
        onNameClick={() => {}}
        RenderSide={Side}
      />
      <AddModal />
      <EditModal />
    </Fragment>
  )
}

const SideButton: FC<{ onClick: () => void }> = ({ onClick, children }) => (
  <Clickable
    tw="text-transparent hover:text-white text-lg font-bold"
    onClick={onClick}
  >
    {children}
  </Clickable>
)

export const SideEditButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <SideButton onClick={onClick}>e</SideButton>
)

const SideAddButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <SideButton onClick={onClick}>+</SideButton>
)
