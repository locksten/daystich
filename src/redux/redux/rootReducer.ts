import { combineReducers } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { metaReducer } from "redux/ducks/meta/meta"
import { timeSpanReducer } from "redux/ducks/timeSpan/timeSpan"
import { taskReducer } from "redux/ducks/task/task"
import { activityReducer } from "redux/ducks/activity/activity"
import { tagReducer } from "redux/ducks/tag/tag"

export const persistConfig = {
  key: "root",
  storage,
}

const rootReducer = persistReducer(
  persistConfig,
  combineReducers({
    meta: metaReducer,
    timeSpan: timeSpanReducer,
    task: taskReducer,
    activity: activityReducer,
    tag: tagReducer,
  }),
)

export type RootState = ReturnType<typeof rootReducer>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default rootReducer
