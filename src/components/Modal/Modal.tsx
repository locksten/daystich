/** @jsx jsx */
import styled from "@emotion/styled"
import Dialog from "@reach/dialog"
import "@reach/dialog/styles.css"
import "twin.macro"

export const CenteredModal = styled(Dialog)`
  background: none;
  > [data-reach-dialog-overlay] {
    background: none;
  }
`

export const Modal = styled(CenteredModal)`
  position: fixed;
  padding: 0;
  margin: 0;
`
