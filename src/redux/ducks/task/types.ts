import { nanoid } from "@reduxjs/toolkit"
import { TagId } from "redux/ducks/tag/types"
import { Brand } from "common/utilityTypes"

export type TaskId = Brand<string, "TaskId">

export const generateTaskId = (nanoid as unknown) as () => TaskId

export type Task = {
  _type: "task"
  id: TaskId
  parentId?: TaskId
  tagIds?: TagId[]
  ordering?: number
  topLevelOrdering?: number
}

export const isTask = (task?: any): task is Task =>
  !!task && "_type" in task && task._type === "task"
