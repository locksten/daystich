import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { persistReducer, persistStore } from "redux-persist"
import { createInitialState } from "redux/initializeStateForNewUser"
import { profilingMiddleware } from "redux/redux/profilingMiddleware"
import rootReducer, { persistConfig } from "redux/redux/rootReducer"

const middleware = getDefaultMiddleware({
  serializableCheck: {
    ignoredActions: ["persist/PERSIST"],
  },
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
  createInitialState(store)
}

export const persistor = persistStore(store, undefined, postStoreHydration)

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("redux/redux/rootReducer", () => {
    const newRootReducer = require("redux/redux/rootReducer").default
    store.replaceReducer(persistReducer(persistConfig, newRootReducer))
  })
}

export default store
