import { nanoid } from "@reduxjs/toolkit"
import { Brand } from "common/utilityTypes"
import { Color } from "styling/color"

export type TagId = Brand<string, "TagId">

export const generateTagId = nanoid as () => TagId

export type Tag = {
  _type: "tag"
  id: TagId
  parentId?: TagId
  name: string
  color?: Color
  ordering?: number
  topLevelOrdering?: number
}

export const isTag = (tag?: any): tag is Tag =>
  !!tag && "_type" in tag && tag._type === "tag"
