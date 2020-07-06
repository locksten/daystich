/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import {
  ActivityCardList,
  TagCardList,
} from "components/ActivitySection/CardList"
import { Card } from "components/Card"
import { Modal, useModal } from "components/modals/Modal"
import { TextField } from "components/TextField"
import { Tag } from "ducks/tag"
import { useEditModeProvider } from "hooks/editMode"
import { useState } from "react"
import "twin.macro"

export const CardListSelectModal: Modal<{
  type: "activity" | "tag"
  title?: string
  onClick: (tag: Tag) => void
}> = ({ type, title, onClick, closeModal }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const { EditModeProvider } = useEditModeProvider()

  const CardListComponent = type === "activity" ? ActivityCardList : TagCardList

  return (
    <Card
      tw="p-0 max-h-full flex flex-col"
      css={css`
        width: min-content;
      `}
    >
      {title && (
        <div tw="mx-4 mt-4 text-center whitespace-normal text-lg font-bold">
          {title}
        </div>
      )}
      <TextField
        tw="mx-4 my-4"
        name="searchBox"
        placeholder={"Search"}
        value={searchTerm}
        onChange={setSearchTerm}
      />
      <div tw="h-full overflow-scroll">
        <EditModeProvider>
          <CardListComponent
            tw="px-4 pb-6"
            config={{
              singleColumn: true,
              filters: { byName: searchTerm },
            }}
            singleConfig={{
              onLeafClick: ({ tag }) => {
                closeModal()
                onClick(tag)
              },
            }}
          />
        </EditModeProvider>
      </div>
    </Card>
  )
}

export const useCardListSelectModal = () =>
  useModal("Select activity or tag", CardListSelectModal)
