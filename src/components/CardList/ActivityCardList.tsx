/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Id } from "common"
import { useAddActivityModal } from "components/modals/AddActivityModal"
import { useEditActivityModal } from "components/modals/EditActivityModal"
import { useAppSelector } from "redux/redux/rootReducer"
import { useAppDispatch } from "redux/redux/store"
import { selectMainActivityTreeList } from "redux/ducks/shared/mainTagTreeSelectors"
import { addTimeSpanNow } from "redux/ducks/timeSpan"
import { useEditMode } from "hooks/editMode"
import { FC } from "react"
import "twin.macro"
import { CardList, CardListConfig } from "./CardList"
import { EditSide } from "./EditSide"
import { SingleConfig } from "./Single"

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

  const nodes = useAppSelector(selectMainActivityTreeList)

  return (
    <CardList
      nodes={nodes}
      config={config ?? {}}
      singleConfig={{ ...defaultSingleConfig, ...singleConfig }}
      {...props}
    />
  )
}
