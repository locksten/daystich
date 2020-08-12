/** @jsx jsx */
import { jsx } from "@emotion/core"
import { useEditMode } from "common/editMode"
import { CardList, CardListConfig } from "components/CardList/CardList"
import { EditSide } from "components/CardList/EditSide"
import { useAddTagModal } from "components/modals/AddTagModal"
import { useEditTagModal } from "components/modals/EditTagModal"
import { FC } from "react"
import { useAppSelector } from "redux/redux/rootReducer"
import "twin.macro"
import { SingleConfig } from "./Single"
import { Tag, TagId } from "redux/ducks/tag/types"
import { selectTagTreeList } from "redux/ducks/tag/selectors"

export const TagCardList: FC<{
  config?: CardListConfig
  singleConfig?: SingleConfig<Tag>
  id?: TagId
}> = ({ config, singleConfig, id, ...props }) => {
  const { isEditMode } = useEditMode()

  const TagSide = undefined

  const TagEditSide: FC<{ id: TagId }> = ({ id }) => {
    const add = useAddTagModal()({ parentId: id })
    const edit = useEditTagModal()({ id })
    return <EditSide addModal={add} editModal={edit} />
  }

  const defaultSingleConfig: Partial<SingleConfig<Tag>> = {
    RenderSide: isEditMode ? TagEditSide : TagSide,
  }

  const nodes = useAppSelector((s) => selectTagTreeList(s, id))

  return (
    <CardList<Tag>
      nodes={nodes}
      config={config ?? {}}
      singleConfig={{ ...defaultSingleConfig, ...singleConfig }}
      {...props}
    />
  )
}
