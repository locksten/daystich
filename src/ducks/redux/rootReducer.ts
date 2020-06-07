import { combineReducers } from "@reduxjs/toolkit"
import tagReducer from "ducks/tag"
import timeSpansReducer from "ducks/timeSpan"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

const persistConfig = {
  key: "root",
  storage,
}

const rootReducer = persistReducer(
  persistConfig,
  combineReducers({
    timeSpans: timeSpansReducer,
    tag: tagReducer,
  }),
)

export type RootState = ReturnType<typeof rootReducer>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default rootReducer
