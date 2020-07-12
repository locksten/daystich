/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Id } from "common"
import { useAddTagModal } from "components/modals/AddTagModal"
import { useEditTagModal } from "components/modals/EditTagModal"
import { useAppSelector } from "redux/redux/rootReducer"
import {
  selectMainTagTreeList,
  selectTagTreeList,
} from "redux/ducks/shared/mainTagTreeSelectors"
import { useEditMode } from "hooks/editMode"
import { FC } from "react"
import "twin.macro"
import { CardList, CardListConfig } from "./CardList"
import { EditSide } from "./EditSide"
import { SingleConfig } from "./Single"

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
    id ? selectTagTreeList(s, id) : selectMainTagTreeList(s),
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
