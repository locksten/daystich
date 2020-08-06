/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Id } from "common/common"
import { Card } from "components/Card"
import { ActivityCardList } from "components/CardList/ActivityCardList"
import { Clickable } from "components/Clickable"
import { IconButton } from "components/IconButton"
import { useAddActivityModal } from "components/modals/AddActivityModal"
import { useAddTagModal } from "components/modals/AddTagModal"
import { useTagCardModal } from "components/modals/TagCardModal"
import { selectMainTagListEntryIds } from "redux/ducks/mainTagList"
import { useAppSelector } from "redux/redux/rootReducer"
import {
  selectTagById,
  selectTagChildrenIds,
  selectTagColor,
} from "redux/ducks/tag"
import { useEditMode, useEditModeProvider } from "common/editMode"
import { FC, Fragment, useState } from "react"
import "twin.macro"
import tw from "twin.macro"
import { rootActivityId } from "redux/ducks/shared/treeNodeRoots"

export const ActivitySection: FC = () => {
  const [selectedTagIdState, setSelectedTagId] = useState<Id | undefined>(
    undefined,
  )

  const selectedTagId = useAppSelector((s) =>
    selectTagById(s, selectedTagIdState ?? ""),
  )?.id

  const addActivityModal = useAddActivityModal()({
    parentTagId: rootActivityId,
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

const RootTags: FC<{ onClick: (id?: Id) => void; selectedTagId?: Id }> = ({
  onClick,
  selectedTagId,
}) => {
  const ids = useAppSelector(selectMainTagListEntryIds)

  const { isEditMode, toggleEditMode } = useEditMode()

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
  id: Id
  onClick: (id?: Id) => void
  isSelected: boolean
}> = ({ id, isSelected, onClick }) => {
  const tag = useAppSelector((s) => selectTagById(s, id))!
  const color = useAppSelector((s) => selectTagColor(s, id))
  const isLeaf =
    useAppSelector((s) => selectTagChildrenIds(s, tag.id)).length === 0
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
