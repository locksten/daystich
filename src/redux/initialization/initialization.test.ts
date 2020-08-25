import { selectIsFirstLaunchInitDone } from "redux/ducks/meta/meta"
import { selectTimespans } from "redux/ducks/timeSpan/selectors"
import { getReduxMocks } from "redux/mocking/mocks"
import {
  selectActivityById,
  selectActivities,
} from "redux/ducks/activity/selectors"
import { selectTags } from "redux/ducks/tag/selectors"
import { firstLaunchInit } from "redux/initialization/firstLaunchInit"

describe("Initialization", () => {
  const { s } = getReduxMocks()

  describe("initializes with", () => {
    it("no activities, tags or timeSpans", () => {
      expect(selectActivities(s())).toHaveLength(0)
      expect(selectTimespans(s())).toHaveLength(0)
    })

    it("isFirstLaunchInitDone set to false", () => {
      expect(selectIsFirstLaunchInitDone(s())).toEqual(false)
    })
  })

  describe("on first launch init", () => {
    describe("if loadDemo is true", () => {
      const { store, s } = getReduxMocks()
      firstLaunchInit(store, { loadDemo: true })

      describe("initializes with", () => {
        it("18 activities", () => {
          expect(selectActivities(s())).toHaveLength(18)
        })

        it("2 tags", () => {
          expect(selectTags(s())).toHaveLength(2)
        })

        it("one timeSpan tracking the untracked activity", () => {
          const timeSpans = selectTimespans(s())
          expect(timeSpans).toHaveLength(1)
          expect(
            selectActivityById(s(), timeSpans[0].activityId)?.name,
          ).toEqual("Untracked")
        })
      })

      it("sets isFirstLaunchInitDone to true", () => {
        expect(selectIsFirstLaunchInitDone(s())).toEqual(true)
      })

      it("does nothing the second time", () => {
        const previousState = s()
        firstLaunchInit(store, { loadDemo: true })
        expect(s()).toEqual(previousState)
      })

      describe("if loadDemo is false", () => {
        const { store, s } = getReduxMocks()
        firstLaunchInit(store, { loadDemo: false })

        describe("initializes with", () => {
          it("one timeSpan tracking the untracked activity", () => {
            const timeSpans = selectTimespans(s())
            expect(timeSpans).toHaveLength(1)
            expect(
              selectActivityById(s(), timeSpans[0].activityId)?.name,
            ).toEqual("Untracked")
          })

          it("no tags", () => {
            expect(selectTags(s())).toHaveLength(0)
          })
        })

        it("sets isFirstLaunchInitDone to true", () => {
          expect(selectIsFirstLaunchInitDone(s())).toEqual(true)
        })

        it("does nothing the second time", () => {
          const previousState = s()
          firstLaunchInit(store, { loadDemo: true })
          expect(s()).toEqual(previousState)
        })
      })
    })
  })
})
