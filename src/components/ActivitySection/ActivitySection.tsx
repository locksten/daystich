/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { useEditMode, useEditModeProvider } from "common/editMode"
import { Card } from "components/Card"
import { ActivityCardList } from "components/CardList/ActivityCardList"
import { Clickable } from "components/Clickable"
import { IconButton } from "components/IconButton"
import { useAddActivityModal } from "components/modals/AddActivityModal"
import { useAddTagModal } from "components/modals/AddTagModal"
import { useTagCardModal } from "components/modals/TagCardModal"
import { FC, Fragment, useState } from "react"
import { useAppSelector } from "redux/redux/rootReducer"
import "twin.macro"
import tw from "twin.macro"
import { TagId } from "redux/ducks/tag/types"
import {
  selectTagById,
  selectTopLevelTagIds,
  selectTagColor,
  selectTagChildren,
} from "redux/ducks/tag/selectors"

export const ActivitySection: FC = () => {
  const [selectedTagIdState, setSelectedTagId] = useState<TagId | undefined>(
    undefined,
  )

  const selectedTagId = useAppSelector((s) =>
    selectTagById(s, selectedTagIdState),
  )?.id

  const addActivityModal = useAddActivityModal()({
    parentId: undefined,
  })

  const { EditModeProvider, isEditMode } = useEditModeProvider()

  return (
    <EditModeProvider>
      <div tw="grid gap-8">
        <RootTags onClick={setSelectedTagId} selectedTagId={selectedTagId} />
        <ActivityCardList
          config={{ filters: { byActivityTagId: selectedTagId } }}
        />
        {isEditMode && (
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

const RootTags: FC<{
  onClick: (id?: TagId) => void
  selectedTagId?: TagId
}> = ({ onClick, selectedTagId }) => {
  const ids = useAppSelector(selectTopLevelTagIds)

  const { isEditMode, toggleEditMode } = useEditMode()

  const addTagModal = useAddTagModal()({
    parentId: undefined,
  })

  const Margin: FC<{}> = ({ children }) => (
    <div tw="m-2 flex items-stretch">{children}</div>
  )

  return (
    <Fragment>
      <div tw="-my-2 flex flex-wrap justify-center items-stretch">
        <Margin>
          <CardButton
            onClick={() => onClick(undefined)}
            isSelected={selectedTagId === undefined}
          >
            Activities
          </CardButton>
        </Margin>
        {ids.map((id) => (
          <Margin key={id}>
            <RootTag
              id={id}
              onClick={onClick}
              isSelected={selectedTagId === id}
            />
          </Margin>
        ))}
        <Margin>
          <CardButton onClick={toggleEditMode} isSelected={isEditMode}>
            {isEditMode ? "Done" : "Edit"}
          </CardButton>
        </Margin>
        {isEditMode && (
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

const RootTag: FC<{
  id: TagId
  onClick: (id?: TagId) => void
  isSelected: boolean
}> = ({ id, isSelected, onClick }) => {
  const tag = useAppSelector((s) => selectTagById(s, id))!
  const color = useAppSelector((s) => selectTagColor(s, id))
  const isLeaf =
    useAppSelector((s) => selectTagChildren(s, tag.id)).length === 0
  const { isEditMode } = useEditMode()
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
            isLeaf && !isEditMode ? onClick(id) : tagCardModal.open()
          }
          isSelected={isSelected}
          css={{ backgroundColor: color }}
        >
          {tag.name}
        </CardButton>
      </tagCardModal.Parent>
    </Fragment>
  )
}

const CardButton: FC<{ onClick: () => void; isSelected?: boolean }> = ({
  onClick,
  isSelected = false,
  children,
  ...props
}) => (
  <Clickable onClick={onClick}>
    <Card
      css={css`
        ${tw`flex bg-gray-600 text-white text-lg font-semibold`};
        ${isSelected && tw`underline`};
      `}
      {...props}
    >
      {children}
    </Card>
  </Clickable>
)
