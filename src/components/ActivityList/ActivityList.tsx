/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Card } from "Card"
import { useAddTagModal } from "components/AddTagModal"
import { Clickable } from "components/Clickable"
import { SecondaryButton } from "components/SecondaryButton"
import { useAppSelector } from "ducks/redux/rootReducer"
import { selectTagById, selectTagChildrenIds, selectTags } from "ducks/tag"
import { useAddTimeSpanNow } from "ducks/timeSpan"
import { FC, Fragment } from "react"
import "twin.macro"
import tw from "twin.macro"

export const ActivityList: FC<{ tagId: string }> = ({ tagId }) => {
  const tagChildrenIds = useAppSelector((s) => selectTagChildrenIds(s, tagId))
  const topLevel = useAppSelector(selectTags)
    .filter((t) => t.displayAtTopLevel === true)
    .map((t) => t.id)
  const tagIds = [...tagChildrenIds, ...topLevel]

  const { Modal, openModal } = useAddTagModal(tagId)

  return (
    <Fragment>
      <div tw="grid grid-cols-3 gap-4">
        {tagIds.map((childId) => (
          <div key={childId}>
            <ActivityListCard tagId={childId} />
          </div>
        ))}
        <SecondaryButton text="Add" onClick={openModal} />
      </div>
      <Modal />
    </Fragment>
  )
}

const ActivityListCard: FC<{ tagId: string }> = ({ tagId }) => {
  const tag = useAppSelector((s) => selectTagById(s, tagId))!
  return (
    <Card css={{ backgroundColor: tag.color || "red" }}>
      <div tw="leading-none pl-1 grid gap-1">
        <SingleTag tagId={tagId} root={true} />
        <TagList tagId={tagId} />
      </div>
    </Card>
  )
}

const TagList: FC<{ tagId: string }> = ({ tagId }) => {
  // const tagChildrenIds = useAppSelector((s) => selectTagChildrenIds(s, tagId))
  const tagChildrenIds = useAppSelector(selectTags)
    .filter((t) => t.displayAtTopLevel !== true && t.parentTagId === tagId)
    .map((t) => t.id)
  return (
    <Fragment>
      {tagChildrenIds.length !== 0 && (
        <div tw="grid gap-1">
          {tagChildrenIds.map((childId) => (
            <div key={childId} tw="pl-3 grid gap-1">
              <SingleTag tagId={childId} />
              <TagList tagId={childId} />
            </div>
          ))}
        </div>
      )}
    </Fragment>
  )
}

const SingleTag: FC<{ tagId: string; root?: boolean }> = ({
  tagId,
  root = false,
}) => {
  const tag = useAppSelector((s) => selectTagById(s, tagId))!
  const addTimespanNow = useAddTimeSpanNow()

  const isLeaf =
    useAppSelector((s) => selectTagChildrenIds(s, tagId)).length === 0
  const isRoot = root || tag.displayAtTopLevel
  const isMiddle = !isLeaf && !isRoot

  const { Modal, openModal } = useAddTagModal(tag.id)

  const TagName: FC<{}> = ({ children, ...props }) =>
    isLeaf ? (
      <Clickable
        onClick={() =>
          addTimespanNow({
            mainTagId: tagId,
            tagIds: [],
          })
        }
        {...props}
      >
        {children}
      </Clickable>
    ) : (
      <div tw="cursor-default" {...props}>
        {children}
      </div>
    )

  const Side: FC<{}> = ({ children, ...props }) => (
    <div tw="flex items-center px-1" {...props}>
      {children}
    </div>
  )

  return (
    <Fragment>
      <div
        css={css`
          ${tw`h-5 flex justify-between items-center -ml-1 pl-1 rounded-md text-white active:text-white`};
          ${isRoot && tw`text-xl font-extrabold`};
          ${tw`text-lg font-semibold`};
          ${isMiddle && tw``};
          ${isLeaf &&
          css`
            &:hover {
              background-color: rgba(0, 0, 0, 0.05);
            }
          `};
        `}
      >
        <TagName tw="flex-grow flex justify-between">{tag.name}</TagName>
        <Side>
          <Clickable
            tw="text-transparent hover:text-white text-lg font-bold"
            onClick={openModal}
          >
            +
          </Clickable>
        </Side>
      </div>
      <Modal />
    </Fragment>
  )
}
