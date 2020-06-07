import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit"
import { Id } from "common"
import { RootState } from "ducks/redux/rootReducer"
import createCachedSelector from "re-reselect"

export type Tag = {
  id: Id
  parentTagId?: Id
  name: string
}

const selectTagState = (state: RootState) => state.tag

const adapter = createEntityAdapter<Tag>()

const selectors = adapter.getSelectors(selectTagState)

const tagSlice = createSlice({
  name: "tag",
  initialState: adapter.getInitialState(),
  reducers: {
    addTag(
      state,
      {
        payload: { id, name, parentTagId },
      }: PayloadAction<Pick<Tag, "id" | "name" | "parentTagId">>,
    ) {
      adapter.addOne(state, { id, name, parentTagId })
    },
  },
})

export const selectTagChildrenIds = createCachedSelector(
  selectTagState,
  (_: RootState, parentTagId: Id) => parentTagId,
  (tags, parentTagId) =>
    Object.values(tags.entities)
      .filter((tag) => tag?.parentTagId === parentTagId)
      .map((tag) => tag!.id),
)((_: RootState, parentTagId) => parentTagId || "")

export const { addTag, selectAll: selectTags, selectById: selectTagById } = {
  ...tagSlice.actions,
  ...selectors,
}

export default tagSlice.reducer
