import {
  updateActivity,
  moveActivity,
  removeActivity,
  detachTopLevelActivityFromParent,
  returnTopLevelActivityToParent,
} from "redux/ducks/activity/activity"
import { selectActivityById } from "redux/ducks/activity/selectors"
import { getReduxMocks } from "redux/mocks"
import { selectTimeSpanById } from "redux/ducks/timeSpan/selectors"
import { removeTag } from "redux/ducks/tag/tag"

describe("Activity", () => {
  it("adds an activity", () => {
    const { s, m } = getReduxMocks()
    const tags = [m.tag({ name: "tag" })]

    const id = m.activity({ name: "activity", tags })
    const activity = selectActivityById(s(), id)!

    expect(activity.name).toEqual("activity")
    expect(activity.tagIds).toEqual(tags)
  })

  it("updates an activity", () => {
    const { s, m, D } = getReduxMocks()
    const tags = [m.tag({ name: "tag1" })]
    const tagsB = [m.tag({ name: "tag2" }), m.tag({ name: "tag3" })]

    const id = m.activity({ name: "activity", tags })

    D(updateActivity({ id, name: "activityB", tagIds: tagsB }))

    const activity = selectActivityById(s(), id)!
    expect(activity.name).toEqual("activityB")
    expect(activity.tagIds).toEqual(tagsB)
  })

  it("removes an ativity with a replacement", () => {
    const { s, m, D } = getReduxMocks()

    const a = m.activity({ name: "a" })
    const b = m.activity({ name: "b", parent: a })
    const c = m.activity({ name: "c" })
    const t = m.timeSpan({ activity: a, startTime: 0 })

    D(
      removeActivity({
        id: a,
        otherAffectedActivityIds: [b],
        affectedTimeSpanIds: [t],
        replacementId: c,
      }),
    )

    expect(selectActivityById(s(), a)).toBeUndefined()
    expect(selectActivityById(s(), b)).toBeUndefined()
    expect(selectActivityById(s(), c)!.topLevelOrdering).toEqual(0)

    expect(selectTimeSpanById(s(), t)!.activityId).toEqual(c)
  })

  describe("Orderings", () => {
    it("adds top level activities in order", () => {
      const { s, m } = getReduxMocks()
      const a = m.activity({ name: "a" })
      const b = m.activity({ name: "b" })
      const c = m.activity({ name: "c" })

      expect(selectActivityById(s(), a)!.topLevelOrdering).toEqual(0)
      expect(selectActivityById(s(), b)!.topLevelOrdering).toEqual(1)
      expect(selectActivityById(s(), c)!.topLevelOrdering).toEqual(2)
    })

    it("moves a top level activity to the top", () => {
      const { s, m, D } = getReduxMocks()
      const a = m.activity({ name: "a" })
      const b = m.activity({ name: "b" })
      const c = m.activity({ name: "c" })

      D(moveActivity({ id: b, to: { topLevelOrdering: 0 } }))

      expect(selectActivityById(s(), a)!.topLevelOrdering).toEqual(1)
      expect(selectActivityById(s(), b)!.topLevelOrdering).toEqual(0)
      expect(selectActivityById(s(), c)!.topLevelOrdering).toEqual(2)
    })

    it("removes a top level activity", () => {
      const { s, m, D } = getReduxMocks()
      const a = m.activity({ name: "a" })
      const b = m.activity({ name: "b" })
      const c = m.activity({ name: "c" })

      D(
        removeActivity({
          id: b,
          otherAffectedActivityIds: [],
          affectedTimeSpanIds: [],
        }),
      )

      expect(selectActivityById(s(), a)!.topLevelOrdering).toEqual(0)
      expect(selectActivityById(s(), b)).toBeUndefined()
      expect(selectActivityById(s(), c)!.topLevelOrdering).toEqual(1)
    })

    it("adds activities in order", () => {
      const { s, m } = getReduxMocks()
      const parent = m.activity({ name: "p" })

      const a = m.activity({ name: "a", parent })
      const b = m.activity({ name: "b", parent })
      const c = m.activity({ name: "c", parent })

      expect(selectActivityById(s(), a)!.topLevelOrdering).toBeUndefined()
      expect(selectActivityById(s(), b)!.topLevelOrdering).toBeUndefined()
      expect(selectActivityById(s(), c)!.topLevelOrdering).toBeUndefined()

      expect(selectActivityById(s(), a)!.ordering).toEqual(0)
      expect(selectActivityById(s(), b)!.ordering).toEqual(1)
      expect(selectActivityById(s(), c)!.ordering).toEqual(2)
    })

    it("moves an activity the top", () => {
      const { s, m, D } = getReduxMocks()
      const parent = m.activity({ name: "p" })

      const a = m.activity({ name: "a", parent })
      const b = m.activity({ name: "b", parent })
      const c = m.activity({ name: "c", parent })

      D(moveActivity({ id: b, to: { parentId: parent, ordering: 0 } }))

      expect(selectActivityById(s(), a)!.ordering).toEqual(1)
      expect(selectActivityById(s(), b)!.ordering).toEqual(0)
      expect(selectActivityById(s(), c)!.ordering).toEqual(2)
    })

    it("moves an activity to the middle", () => {
      const { s, m, D } = getReduxMocks()
      const parent = m.activity({ name: "p" })

      const a = m.activity({ name: "a", parent })
      const b = m.activity({ name: "b", parent })
      const c = m.activity({ name: "c", parent })
      const d = m.activity({ name: "d", parent })
      const e = m.activity({ name: "e", parent })

      D(moveActivity({ id: d, to: { parentId: parent, ordering: 1 } }))

      expect(selectActivityById(s(), a)!.ordering).toEqual(0)
      expect(selectActivityById(s(), b)!.ordering).toEqual(2)
      expect(selectActivityById(s(), c)!.ordering).toEqual(3)
      expect(selectActivityById(s(), d)!.ordering).toEqual(1)
      expect(selectActivityById(s(), e)!.ordering).toEqual(4)
    })

    it("moves activities to a parent", () => {
      const { s, m, D } = getReduxMocks()

      const a = m.activity({ name: "a" })
      const b = m.activity({ name: "b" })
      const c = m.activity({ name: "c" })
      const d = m.activity({ name: "d" })
      const e = m.activity({ name: "e" })

      D(moveActivity({ id: b, to: { parentId: a, ordering: -1 } }))
      D(moveActivity({ id: c, to: { parentId: a, ordering: -1 } }))

      D(moveActivity({ id: d, to: { parentId: c, ordering: -1 } }))
      D(moveActivity({ id: e, to: { parentId: c, ordering: -1 } }))

      const a1 = selectActivityById(s(), a)!
      const b1 = selectActivityById(s(), b)!
      const c1 = selectActivityById(s(), c)!
      const d1 = selectActivityById(s(), d)!
      const e1 = selectActivityById(s(), e)!

      expect(a1.parentId).toBeUndefined()

      expect(b1.parentId).toEqual(a)
      expect(b1.ordering).toEqual(0)
      expect(c1.parentId).toEqual(a)
      expect(c1.ordering).toEqual(1)

      expect(d1.parentId).toEqual(c)
      expect(d1.ordering).toEqual(0)
      expect(e1.parentId).toEqual(c)
      expect(e1.ordering).toEqual(1)
    })

    it("moves an activity to the top level", () => {
      const { s, m, D } = getReduxMocks()

      const a = m.activity({ name: "a" })
      const b = m.activity({ name: "b", parent: a })

      D(
        moveActivity({
          id: b,
          to: { parentId: undefined, topLevelOrdering: -1 },
        }),
      )

      const b1 = selectActivityById(s(), b)!

      expect(b1.parentId).toEqual(a)
      expect(b1.ordering).toEqual(0)
      expect(b1.topLevelOrdering).toEqual(1)
    })

    it("detaches an activity from the top level", () => {
      const { s, m, D } = getReduxMocks()

      const a = m.activity({ name: "a" })
      const b = m.activity({ name: "b", parent: a })

      D(
        moveActivity({
          id: b,
          to: { parentId: undefined, topLevelOrdering: -1 },
        }),
      )

      D(detachTopLevelActivityFromParent({ id: b }))

      const b1 = selectActivityById(s(), b)!

      expect(b1.parentId).toBeUndefined()
      expect(b1.ordering).toBeUndefined()
      expect(b1.topLevelOrdering).toEqual(1)
    })

    it("returns an activity from the top level to it's parent", () => {
      const { s, m, D } = getReduxMocks()

      const a = m.activity({ name: "a" })
      const b = m.activity({ name: "b", parent: a })

      D(
        moveActivity({
          id: b,
          to: { parentId: undefined, topLevelOrdering: -1 },
        }),
      )

      D(returnTopLevelActivityToParent({ id: b }))

      const b1 = selectActivityById(s(), b)!

      expect(b1.topLevelOrdering).toBeUndefined()
      expect(b1.parentId).toEqual(a)
      expect(b1.ordering).toEqual(0)
    })

    it("ignores moving an activity into it's descendant", () => {
      const { s, m, D } = getReduxMocks()

      const a = m.activity({ name: "a" })
      const b = m.activity({ name: "b", parent: a })
      const c = m.activity({ name: "c", parent: b })

      const a0 = selectActivityById(s(), a)!

      D(
        moveActivity({
          id: a,
          to: { parentId: b, ordering: -1 },
        }),
      )

      const a1 = selectActivityById(s(), a)!
      expect(a1).toEqual(a0)

      D(
        moveActivity({
          id: a,
          to: { parentId: c, ordering: -1 },
        }),
      )

      const a2 = selectActivityById(s(), a)!
      expect(a2).toEqual(a0)
    })

    it("removes tags that are removed, with a replacement", () => {
      const { s, m, D } = getReduxMocks()

      const w = m.tag({ name: "w" })
      const x = m.tag({ name: "x", parent: w })
      const y = m.tag({ name: "y" })
      const z = m.tag({ name: "z" })
      const a = m.activity({ name: "a", tags: [x, y] })

      expect(selectActivityById(s(), a)!.tagIds).toEqual([x, y])

      D(
        removeTag({
          id: w,
          otherAffectedTagIds: [x],
          affectedActivityIds: [a],
          affectedTimeSpanIds: [],
          replacementId: z,
        }),
      )

      expect(selectActivityById(s(), a)!.tagIds).toEqual([y, z])
    })
  })
})
