import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import { profilingMiddleware } from "redux/redux/profilingMiddleware"
import rootReducer, { persistConfig } from "redux/redux/rootReducer"
import { useDispatch } from "react-redux"
import { persistStore, persistReducer } from "redux-persist"

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

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("redux/redux/rootReducer", () => {
    const newRootReducer = require("redux/redux/rootReducer").default
    store.replaceReducer(persistReducer(persistConfig, newRootReducer))
  })
}

export default store
