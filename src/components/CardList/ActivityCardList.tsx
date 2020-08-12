/** @jsx jsx */
import { jsx } from "@emotion/core"
import { useEditMode } from "common/editMode"
import { useAddActivityModal } from "components/modals/AddActivityModal"
import { useEditActivityModal } from "components/modals/EditActivityModal"
import { FC } from "react"
import { selectActivityTreeList } from "redux/ducks/activity/selectors"
import { Activity, ActivityId } from "redux/ducks/activity/types"
import { useAppSelector } from "redux/redux/rootReducer"
import "twin.macro"
import { CardList, CardListConfig } from "./CardList"
import { EditSide } from "./EditSide"
import { SingleConfig } from "./Single"
import { useAppDispatch } from "redux/redux/store"
import { addTimeSpanNow } from "redux/ducks/timeSpan/timeSpan"

export const ActivityCardList: FC<{
  config?: CardListConfig
  singleConfig?: SingleConfig<Activity>
}> = ({ config, singleConfig, ...props }) => {
  const { isEditMode } = useEditMode()
  const dispatch = useAppDispatch()

  const ActivitySide = undefined

  const ActivityEditSide: FC<{ id: ActivityId }> = ({ id }) => {
    const add = useAddActivityModal()({ parentId: id })
    const edit = useEditActivityModal()({ id })
    return <EditSide addModal={add} editModal={edit} />
  }

  const defaultSingleConfig: Partial<SingleConfig<Activity>> = {
    RenderSide: isEditMode ? ActivityEditSide : ActivitySide,
    onLeafClick: ({ id }) => dispatch(addTimeSpanNow({ activityId: id })),
  }

  const nodes = useAppSelector((s) => selectActivityTreeList(s, undefined))

  return (
    <CardList<Activity>
      nodes={nodes}
      config={config ?? {}}
      singleConfig={{ ...defaultSingleConfig, ...singleConfig }}
      {...props}
    />
  )
}
