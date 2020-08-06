import { combineReducers } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { activityReducer } from "redux/ducks/activity"
import { mainActivityListReducer } from "redux/ducks/mainActivityList"
import { mainTagListReducer } from "redux/ducks/mainTagList"
import { metaReducer } from "redux/ducks/meta"
import { tagReducer } from "redux/ducks/tag"
import { timeSpanReducer } from "redux/ducks/timeSpan"

export const persistConfig = {
  key: "root",
  storage,
}

const rootReducer = persistReducer(
  persistConfig,
  combineReducers({
    meta: metaReducer,
    timeSpan: timeSpanReducer,
    tag: tagReducer,
    mainTagList: mainTagListReducer,
    activity: activityReducer,
    mainActivityList: mainActivityListReducer,
  }),
)

export type RootState = ReturnType<typeof rootReducer>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default rootReducer
