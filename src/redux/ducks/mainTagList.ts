import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import { Id } from "common/common"
import { addTag, moveTag, removeTag } from "redux/ducks/shared/actions"
import {
  moveOneOrderable,
  removeManyOrderables,
  removeOneOrderable,
  upsertOneOrderable,
} from "redux/ordering"
import { RootState } from "redux/redux/rootReducer"

export type MainTagListEntry = {
  id: Id
  ordering: number
}

export const selectMainTagListState = (state: RootState) => state.mainTagList

const adapter = createEntityAdapter<MainTagListEntry>({
  sortComparer: (a, b) => a.ordering - b.ordering,
})
export const mainTagListAdapter = adapter

const selectors = adapter.getSelectors(selectMainTagListState)

const initialState = adapter.getInitialState()

const mainTagListSlice = createSlice({
  name: "mainTagList",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      addTag,
      (
        state,
        { payload: { tag, newParentIsTopLevel, additionalParentId } },
      ) => {
        if (newParentIsTopLevel && additionalParentId) {
          const parentPos = adapter
            .getSelectors()
            .selectById(state, tag.parentTagId!)!.ordering
          removeOneOrderable(state, adapter, tag.parentTagId!)
          upsertOneOrderable(
            state,
            adapter,
            { id: additionalParentId },
            parentPos,
          )
        } else if (tag.parentTagId === undefined) {
          upsertOneOrderable(state, adapter, { id: tag.id })
        }
      },
    )
    builder.addCase(removeTag, (state, { payload: { affectedTagIds } }) => {
      removeManyOrderables(state, adapter, affectedTagIds)
    })
    builder.addCase(
      moveTag,
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
        } else if (newParentId === undefined) {
          if (newPosition !== undefined)
            moveOneOrderable(state, adapter, { id }, newPosition)
        } else {
          console.log(`rm`)
          removeOneOrderable(state, adapter, id)
        }
      },
    )
  },
})

export const mainTagListReducer = mainTagListSlice.reducer

// export const {} = {
//   ...mainTagListSlice.actions,
// }

export const {
  selectAll: selectMainTagListEntries,
  selectById: selectMainTagListEntryById,
} = {
  ...selectors,
}

export const selectMainTagListEntryIds = createSelector(
  selectors.selectIds,
  (ids) => ids as Id[],
)
