import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import { profilingMiddleware } from "ducks/redux/profilingMiddleware"
import rootReducer from "ducks/redux/rootReducer"
import { useDispatch } from "react-redux"
import { persistStore } from "redux-persist"

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
  module.hot.accept("ducks/redux/rootReducer", () => {
    const newRootReducer = require("ducks/redux/rootReducer").default
    store.replaceReducer(newRootReducer)
  })
}

export default store
