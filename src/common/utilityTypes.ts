export {}

export type PartialExcept<T, K extends keyof T> = Partial<UnionOmit<T, K>> &
  Pick<T, K>

export type UnionOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never

interface Branding<BrandT> {
  _type: BrandT
}
export type Brand<T, BrandT> = T & Branding<BrandT>

interface Flavoring<FlavorT> {
  _type?: FlavorT
}
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>

export type AllOrNone<T> = T | { [K in keyof T]?: never }

export const withPayloadType = <T>() => {
  return (t: T) => ({ payload: t })
}
