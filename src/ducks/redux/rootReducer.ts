import { combineReducers } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { activityReducer } from "ducks/activity"
import { tagReducer } from "ducks/tag"
import { timeSpanReducer } from "ducks/timeSpan"

export const persistConfig = {
  key: "root",
  storage,
}

const rootReducer = persistReducer(
  persistConfig,
  combineReducers({
    timeSpan: timeSpanReducer,
    tag: tagReducer,
    activity: activityReducer,
  }),
)

export type RootState = ReturnType<typeof rootReducer>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default rootReducer
