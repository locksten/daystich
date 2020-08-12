/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { DialogContent, DialogOverlay } from "@reach/dialog"
import "@reach/dialog/styles.css"
import { FC, Fragment, useState } from "react"
import "twin.macro"
import { UnionOmit } from "common/utilityTypes"

export type Modal<T = {}> = FC<{ closeModal: () => void } & T>

export const useModal = <T extends { closeModal: () => void }>(
  label: string,
  RenderModal: FC<T>,
  rect?: DOMRect,
) => {
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (args: UnionOmit<T, "closeModal">) => ({
    Modal: () => (
      <Fragment>
        {isOpen && (
          <DialogOverlay
            css={css`
              background: none;
              display: flex;
            `}
            tw="z-30"
            isOpen={isOpen}
            onDismiss={close}
          >
            <DialogContent
              aria-label={label}
              css={css`
                ${css`
                  background: none;
                  width: auto;
                  margin: 0rem;
                  padding: 0rem;
                `};
                ${rect
                  ? css`
                      position: fixed;
                      top: ${rect.top}px;
                      left: ${rect.left}px;
                      min-width: ${rect.width}px;
                      min-height: ${rect.height}px;
                    `
                  : css`
                      margin: auto;
                      max-height: calc(100vh - 10vw);
                    `};
              `}
            >
              <RenderModal closeModal={close} {...(args as any)} />
            </DialogContent>
          </DialogOverlay>
        )}
      </Fragment>
    ),
    open,
    close,
  })
}

export type ModalHookReturnType = ReturnType<ReturnType<typeof useModal>>
