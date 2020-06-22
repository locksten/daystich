/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Id } from "common"
import { ActivityCardList } from "components/ActivitySection/CardList"
import { Card } from "components/Card"
import { Clickable } from "components/Clickable"
import { IconButton } from "components/IconButton"
import { useAddActivityModal } from "components/modals/AddActivityModal"
import { useAddTagModal } from "components/modals/AddTagModal"
import { useTagCardModal } from "components/modals/TagCardModal"
import { rootActivityId } from "ducks/common"
import { useAppSelector } from "ducks/redux/rootReducer"
import {
  selectTagById,
  selectTagChildrenIds,
  selectTagColor,
  selectTopLevelDisplayTagIds,
} from "ducks/tag"
import { useEditMode, useEditModeProvider } from "hooks/editMode"
import { FC, Fragment, useState } from "react"
import "twin.macro"
import tw from "twin.macro"

export const ActivitySection: FC<{}> = () => {
  const [selectedTagId, setSelectedTagId] = useState<Id | undefined>(undefined)

  const addActivityModal = useAddActivityModal()({
    parentTagId: rootActivityId,
  })

  const { EditModeProvider, editMode } = useEditModeProvider()

  return (
    <EditModeProvider>
      <div tw="grid gap-8">
        <RootTags onClick={setSelectedTagId} />
        <ActivityCardList
          config={{ filters: { byActivityTagId: selectedTagId } }}
        />
        {editMode && (
          <IconButton
            onClick={addActivityModal.open}
            background="circle"
            icon="add"
          />
        )}
      </div>
      <addActivityModal.Modal />
    </EditModeProvider>
  )
}

const RootTags: FC<{ onClick: (id?: Id) => void }> = ({ onClick }) => {
  const ids = useAppSelector(selectTopLevelDisplayTagIds)

  const { editMode, toggleEditMode } = useEditMode()

  const addTagModal = useAddTagModal()({
    parentTagId: undefined,
  })

  const Margin: FC<{}> = ({ children }) => (
    <div tw="m-2 flex items-stretch">{children}</div>
  )

  return (
    <Fragment>
      <div tw="-my-2 flex flex-wrap justify-center items-stretch">
        <Margin>
          <CardButton onClick={() => onClick(undefined)}>Activities</CardButton>
        </Margin>
        {ids.map((id) => (
          <Margin key={id}>
            <RootTag id={id} onClick={onClick} />
          </Margin>
        ))}
        <Margin>
          <CardButton
            onClick={toggleEditMode}
            css={css`
              ${editMode && tw`underline`}
            `}
          >
            {editMode ? "Done" : "Edit"}
          </CardButton>
        </Margin>
        {editMode && (
          <Margin>
            <IconButton
              onClick={addTagModal.open}
              tw="self-center"
              background="circle"
              icon="add"
            />
          </Margin>
        )}
      </div>
      <addTagModal.Modal />
    </Fragment>
  )
}

const RootTag: FC<{ id: Id; onClick: (id?: Id) => void }> = ({
  id,
  onClick,
}) => {
  const tag = useAppSelector((s) => selectTagById(s, id))!
  const color = useAppSelector((s) => selectTagColor(s, id))
  const isLeaf =
    useAppSelector((s) => selectTagChildrenIds(s, tag.id)).length === 0
  const { editMode } = useEditMode()
  const tagCardModal = useTagCardModal({
    id: id,
    onClick: (tag) => onClick(tag.id),
  })

  return (
    <Fragment>
      <tagCardModal.Modal />
      <tagCardModal.Parent>
        <CardButton
          onClick={() =>
            isLeaf && !editMode ? onClick(id) : tagCardModal.open()
          }
          css={{ backgroundColor: color }}
        >
          {tag.name}
        </CardButton>
      </tagCardModal.Parent>
    </Fragment>
  )
}

const CardButton: FC<{ onClick: () => void }> = ({
  onClick,
  children,
  ...props
}) => (
  <Clickable onClick={onClick}>
    <Card tw="flex bg-gray-600 text-white text-lg font-semibold" {...props}>
      {children}
    </Card>
  </Clickable>
)
