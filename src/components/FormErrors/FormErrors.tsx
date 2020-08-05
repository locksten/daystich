/** @jsx jsx */
import { jsx } from "@emotion/core"
import { FC, Fragment } from "react"
import { FieldError } from "react-hook-form"
import { FieldErrors } from "react-hook-form/dist/types/form"
import "twin.macro"

export const FormErrors: FC<{ errors: FieldErrors }> = ({ errors }) => {
  const Error: FC<{
    nameKey: string
    error: FieldError | FieldError[]
  }> = ({ nameKey, error }) => {
    return (
      <li>
        {Array.isArray(error) ? (
          <ul>
            {error.map((err, idx) => (
              <Error key={nameKey} nameKey={`${idx}-${nameKey}`} error={err} />
            ))}
          </ul>
        ) : (
          error.message
        )}
      </li>
    )
  }

  const activeErrors = Object.entries(errors).filter(([_, error]) => error)

  return (
    <Fragment>
      {activeErrors.length !== 0 && (
        <div tw="py-2 px-3 bg-red-300 text-red-900 font-semibold rounded-md">
          <ul>
            {activeErrors.map(([name, error]) => (
              <Error
                key={name}
                nameKey={name}
                error={error as FieldError | FieldError[]}
              />
            ))}
          </ul>
        </div>
      )}
    </Fragment>
  )
}
