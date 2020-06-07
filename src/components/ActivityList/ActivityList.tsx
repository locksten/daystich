/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Card } from "Card"
import { useAppSelector } from "ducks/redux/rootReducer"
import { selectTagById, selectTagChildrenIds } from "ducks/tag"
import { FC } from "react"
import "twin.macro"
import { Clickable } from "components/Clickable"

export const ActivityList: FC<{ tagId: string }> = ({ tagId }) => {
  const tagChildrenIds = useAppSelector((s) => selectTagChildrenIds(s, tagId))
  return (
    <div tw="grid grid-cols-3 gap-4">
      {tagChildrenIds.map((childId) => (
        <div key={childId}>
          <Card tw="bg-green-400 leading-none">
            <div tw="grid gap-1 pl-1">
              <TopLevelTitleTag tagId={childId} />
              <TagList tagId={childId} level={1} />
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}

const TagList: FC<{ tagId: string; level: number }> = ({ tagId, level }) => {
  const tagChildrenIds = useAppSelector((s) => selectTagChildrenIds(s, tagId))
  return (
    <div tw="grid gap-1">
      {tagChildrenIds.map((childId) => (
        <ChildTag key={childId} level={level + 1} tagId={childId} />
      ))}
    </div>
  )
}

const ChildTag: FC<{ tagId: string; level: number }> = ({ tagId, level }) => {
  const tagChildrenIds = useAppSelector((s) => selectTagChildrenIds(s, tagId))
  return (
    <div tw="pl-3">
      {tagChildrenIds.length === 0 ? (
        <div tw="grid">
          <SingleTag tagId={tagId} />
        </div>
      ) : (
        <div tw="grid gap-1">
          <TagTitle tagId={tagId} />
          <TagList tagId={tagId} level={level} />
        </div>
      )}
    </div>
  )
}

const TopLevelTitleTag: FC<{ tagId: string }> = ({ tagId }) => {
  const tag = useAppSelector((s) => selectTagById(s, tagId))!
  return (
    <div tw="text-white text-xl font-extrabold cursor-default">{tag.name}</div>
  )
}

const TagTitle: FC<{ tagId: string }> = ({ tagId }) => {
  const tag = useAppSelector((s) => selectTagById(s, tagId))!
  return (
    <div tw="h-5 text-white text-lg font-bold cursor-default">{tag.name}</div>
  )
}

const SingleTag: FC<{ tagId: string }> = ({ tagId }) => {
  const tag = useAppSelector((s) => selectTagById(s, tagId))!
  return (
    <Clickable tw="h-5 flex justify-between items-center -ml-1 pl-1 rounded-md text-white active:text-white text-lg font-bold hover:bg-green-500">
      {tag.name}
      <div tw="flex items-center px-1 text-sm font-light"></div>
    </Clickable>
  )
}
