import { Middleware } from "@reduxjs/toolkit"

export const profilingMiddleware: Middleware = (_) => (next) => (action) => {
  performance.mark(`${action.type}_start`)
  const result = next(action)
  performance.mark(`${action.type}_end`)
  performance.measure(
    `📤 ${action.type}`,
    `${action.type}_start`,
    `${action.type}_end`,
  )
  return result
}
