import { createSlice } from "@reduxjs/toolkit"
import { taskAdapter as adapter } from "redux/ducks/task/selectors"

const taskSlice = createSlice({
  name: "task",
  initialState: adapter.getInitialState(),
  reducers: {},
})

export const taskReducer = taskSlice.reducer
