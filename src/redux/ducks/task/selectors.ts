import { createEntityAdapter } from "@reduxjs/toolkit"
import { Task, TaskId } from "redux/ducks/task/types"
import { RootState } from "redux/redux/rootReducer"

export const selectTaskState = (state: RootState) => state.task

export const taskAdapter = createEntityAdapter<Task>()

const selectors = taskAdapter.getSelectors(selectTaskState)

export const {
  selectAll: selectTasks,
  selectEntities: selectTaskDictionary,
} = {
  ...selectors,
}

export const selectTaskById = (state: RootState, id?: TaskId) =>
  selectors.selectById(state, id ?? "")
