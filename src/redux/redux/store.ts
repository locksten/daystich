import {
  Action,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { persistReducer, persistStore } from "redux-persist"
import { profilingMiddleware } from "redux/redux/profilingMiddleware"
import rootReducer, { persistConfig, RootState } from "redux/redux/rootReducer"
import { firstLaunchInit } from "redux/initialization/firstLaunchInit"

const middleware = getDefaultMiddleware({
  serializableCheck: false,
  immutableCheck: false,
})

if (process.env.NODE_ENV === "development") {
  middleware.push(profilingMiddleware)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: middleware,
})

export type AppStore = typeof store

const postStoreHydration = () => {
  firstLaunchInit(store, { loadDemo: true })
}

export const persistor = persistStore(store, undefined, postStoreHydration)

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export type AppThunk<R = void> = ThunkAction<
  R,
  RootState,
  unknown,
  Action<string>
>

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("redux/redux/rootReducer", () => {
    const newRootReducer = require("redux/redux/rootReducer").default
    store.replaceReducer(persistReducer(persistConfig, newRootReducer))
  })
}

export default store
