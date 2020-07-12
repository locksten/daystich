import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { Id } from "common"
import {
  addActivity,
  moveActivity,
  removeActivity,
} from "redux/ducks/shared/actions"
import { isRootActivityId } from "redux/common"
import {
  removeManyOrderables,
  removeOneOrderable,
  upsertOneOrderable,
  moveOneOrderable,
} from "redux/ordering"
import { RootState } from "redux/redux/rootReducer"

export type MainActivityListEntry = {
  id: Id
  ordering: number
}

export const selectMainActivityListState = (state: RootState) =>
  state.mainActivityList

const adapter = createEntityAdapter<MainActivityListEntry>({
  sortComparer: (a, b) => a.ordering - b.ordering,
})
export const mainActivityListAdapter = adapter

const selectors = adapter.getSelectors(selectMainActivityListState)

const initialState = adapter.getInitialState()

const mainActivityListSlice = createSlice({
  name: "mainActivityList",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      addActivity,
      (
        state,
        { payload: { activityTag, newParentIsTopLevel, additionalParentId } },
      ) => {
        if (newParentIsTopLevel && additionalParentId) {
          const parentPos = adapter
            .getSelectors()
            .selectById(state, activityTag.parentTagId!)!.ordering
          removeOneOrderable(state, adapter, activityTag.parentTagId!)
          upsertOneOrderable(
            state,
            adapter,
            { id: additionalParentId },
            parentPos,
          )
        } else if (isRootActivityId(activityTag.parentTagId)) {
          upsertOneOrderable(state, adapter, { id: activityTag.id })
        }
      },
    )
    builder.addCase(
      removeActivity,
      (state, { payload: { affectedActivityIds } }) => {
        removeManyOrderables(state, adapter, affectedActivityIds)
      },
    )
    builder.addCase(
      moveActivity,
      (
        state,
        {
          payload: {
            id,
            newParentId,
            newParentIsTopLevel,
            additionalParentId,
            newPosition,
          },
        },
      ) => {
        if (newParentId && newParentIsTopLevel && additionalParentId) {
          const parentPos = adapter
            .getSelectors()
            .selectById(state, newParentId!)!.ordering
          removeOneOrderable(state, adapter, id)
          removeOneOrderable(state, adapter, newParentId)
          upsertOneOrderable(
            state,
            adapter,
            { id: additionalParentId },
            parentPos,
          )
        } else if (isRootActivityId(newParentId)) {
          if (newPosition !== undefined)
            moveOneOrderable(state, adapter, { id }, newPosition)
        } else {
          removeOneOrderable(state, adapter, id)
        }
      },
    )
  },
})

export const mainActivityListReducer = mainActivityListSlice.reducer

// export const {} = {
//   ...mainActivityListSlice.actions,
// }

export const {
  selectAll: selectMainActivityListEntries,
  selectById: selectMainActivityListEntryById,
} = {
  ...selectors,
}
