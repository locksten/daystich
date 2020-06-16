/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Id } from "common"
import {
  ActivityCardList,
  SideEditButton,
  TagCardList,
} from "components/ActivitySection/CardList"
import { Card } from "components/Card"
import { Clickable } from "components/Clickable"
import { useEditActivityModal } from "components/EditActivityModal"
import { useEditTagModal } from "components/EditTagModal"
import { rootActivityId } from "ducks/redux/common"
import { useAppSelector } from "ducks/redux/rootReducer"
import { selectRootTagIds, selectTagById, selectTagColor } from "ducks/tag"
import { FC, Fragment, useState } from "react"
import "twin.macro"
import { useAddTagModal } from "components/AddTagModal"

export const ActivitySectionTabbedContainer: FC<{}> = () => {
  const [selectedTagId, setSelectedTagId] = useState(rootActivityId)

  return (
    <div tw="grid gap-4">
      <RootTags onClick={(id) => setSelectedTagId(id)} />
      {selectedTagId === rootActivityId ? (
        <ActivityCardList />
      ) : (
        <TagCardList id={selectedTagId} />
      )}
    </div>
  )
}

const RootTags: FC<{ onClick: (id: Id) => void }> = ({ onClick }) => {
  const rootTagIds = useAppSelector(selectRootTagIds)
  const { Modal: AddModal, openModal: openAddModal } = useAddTagModal()

  return (
    <Fragment>
      <div tw="grid grid-flow-col gap-4 p-4">
        {rootTagIds.map((id) => (
          <RootTag key={id} id={id} onClick={onClick} />
        ))}

        <Clickable onClick={openAddModal}>
          <Card tw="flex bg-gray-600 text-white text-lg font-semibold">
            <div tw="w-full text-center">Add Tag</div>
          </Card>
        </Clickable>
      </div>
      <AddModal />
    </Fragment>
  )
}

const RootTag: FC<{ id: Id; onClick: (id: Id) => void }> = ({
  id,
  onClick,
}) => {
  const tag = useAppSelector((s) => selectTagById(s, id))!
  const color = useAppSelector((s) => selectTagColor(s, id))
  const { Modal: EditTagModal, openModal: openTagEditModal } = useEditTagModal(
    id,
  )
  const {
    Modal: EditActivtiyModal,
    openModal: openEditActivityModal,
  } = useEditActivityModal(id)

  const isActivity = id === rootActivityId
  const openModal = () =>
    isActivity ? openEditActivityModal() : openTagEditModal()

  return (
    <Fragment>
      <Card
        tw="flex text-white text-lg font-semibold"
        css={{ backgroundColor: color }}
      >
        <Clickable tw="w-full text-center" onClick={() => onClick(id)}>
          {tag.name}
        </Clickable>
        <SideEditButton onClick={openModal} />
      </Card>
      <EditTagModal />
      <EditActivtiyModal />
    </Fragment>
  )
}
