import { AppStore } from "redux/redux/store"
import { MockStore } from "redux/mocking/mocks"
import {
  selectIsFirstLaunchInitDone,
  finishFirstLaunchInit,
} from "redux/ducks/meta/meta"
import { setUpCoreInitialStore } from "redux/initialization/coreInitialStore"
import { addDemoState } from "redux/initialization/demoState"

export const firstLaunchInit = (
  store: AppStore | MockStore,
  { loadDemo }: { loadDemo: boolean },
) => {
  if (selectIsFirstLaunchInitDone(store.getState())) return
  setUpCoreInitialStore(store)
  loadDemo && addDemoState(store)
  store.dispatch(finishFirstLaunchInit())
}
