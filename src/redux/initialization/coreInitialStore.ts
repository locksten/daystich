import { addTimeSpanNow } from "redux/ducks/timeSpan/timeSpan"
import { getReduxMocks, MockStore } from "redux/mocking/mocks"
import { AppStore } from "redux/redux/store"

export const setUpCoreInitialStore = (store: AppStore | MockStore) => {
  const { m, D } = getReduxMocks(store)

  const untracked = m.activity({ name: "Untracked", color: 2 })
  D(addTimeSpanNow({ activityId: untracked }))
}
