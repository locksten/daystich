/** @jsx jsx */
import { jsx } from "@emotion/core"
import styled from "@emotion/styled"
import Dialog from "@reach/dialog"
import "@reach/dialog/styles.css"
import { Fragment, useState, ReactElement } from "react"
import "twin.macro"

export const Modal = styled(Dialog)`
  background: none;
  > [data-reach-dialog-overlay] {
    background: none;
  }
`

export const useModal = (Modal: (props: any) => ReactElement) => {
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return {
    Modal: () => (
      <Fragment>
        {isOpen && <Modal isOpen={isOpen} onDismiss={close} />}
      </Fragment>
    ),
    openModal: open,
  }
}
