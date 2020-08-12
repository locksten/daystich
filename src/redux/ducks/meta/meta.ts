import { createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "redux/redux/rootReducer"

const selectMetaState = (state: RootState) => state.meta

type MetaSlice = {
  isFirstLaunchInitFinished: boolean
}

const initialState: Partial<MetaSlice> = { isFirstLaunchInitFinished: false }

const metaSlice = createSlice({
  name: "meta",
  initialState,
  reducers: {
    finishFirstLaunchInit: (state) => {
      state.isFirstLaunchInitFinished = true
    },
  },
})

export const metaReducer = metaSlice.reducer

export const { finishFirstLaunchInit } = {
  ...metaSlice.actions,
}

export const selectIsFirstLaunchInitDone = createSelector(
  selectMetaState,
  ({ isFirstLaunchInitFinished }) => isFirstLaunchInitFinished,
)
