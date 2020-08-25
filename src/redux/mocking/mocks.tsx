/** @jsx jsx */
import { jsx } from "@emotion/core"
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import { createContext, FC, useContext } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { firstLaunchInit } from "redux/initialization/firstLaunchInit"
import rootReducer from "redux/redux/rootReducer"
import { AppStore } from "redux/redux/store"
import { makeMocks } from "./makeMocks"

export const getEmptyMockStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  })
}

export type MockStore = ReturnType<typeof getEmptyMockStore>

export const getMockStore = () => {
  const store = getEmptyMockStore()
  return { ...store, s: store.getState, d: store.dispatch }
}

export const getReduxMocks = (store?: AppStore) => {
  if (store === undefined) {
    const store = getMockStore()
    return { m: makeMocks(store), store, D: store.d, s: store.s }
  } else {
    return { m: makeMocks(store), store, D: store.dispatch, s: store.getState }
  }
}

const ReduxMockContext = createContext({
  m: (undefined as unknown) as ReturnType<typeof getReduxMocks>["m"],
  D: (undefined as unknown) as ReturnType<typeof getReduxMocks>["D"],
  s: (undefined as unknown) as ReturnType<typeof getReduxMocks>["s"],
  store: (undefined as unknown) as ReturnType<typeof getReduxMocks>["store"],
})

export const useReduxMocks = (config?: {
  loadCore?: boolean
  loadDemo?: boolean
}) => {
  const mocks = useContext(ReduxMockContext)
  ;(config?.loadCore || config?.loadDemo) &&
    firstLaunchInit(mocks.store, { loadDemo: !!config?.loadDemo })
  return mocks
}

export const ReduxMockStoreProvider: FC = ({ children }) => {
  const { store, m, D, s } = getReduxMocks()

  return (
    <ReduxMockContext.Provider value={{ store, m, D, s }}>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </ReduxMockContext.Provider>
  )
}
