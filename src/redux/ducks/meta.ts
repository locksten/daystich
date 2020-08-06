import { createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "redux/redux/rootReducer"

const selectMetaState = (state: RootState) => state.meta

const metaSlice = createSlice({
  name: "meta",
  initialState: { newUserFirstLoad: true },
  reducers: {
    finishNewUserFirstLoad: (state) => {
      state.newUserFirstLoad = false
    },
  },
})

export const metaReducer = metaSlice.reducer

export const { finishNewUserFirstLoad } = {
  ...metaSlice.actions,
}

export const selectIsNewUserFirstLoad = createSelector(
  selectMetaState,
  ({ newUserFirstLoad }) => newUserFirstLoad,
)
