/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { TagCardList } from "components/CardList/TagCardList"
import { ActivityCardList } from "components/CardList/ActivityCardList"
import { Card } from "components/Card"
import { Modal, useModal } from "components/modals/Modal"
import { TextField } from "components/TextField"
import { Tag } from "redux/ducks/tag"
import { useEditModeProvider } from "common/editMode"
import { useState, ReactNode } from "react"
import "twin.macro"
import { Filters } from "components/CardList/filters"

export const CardListSelectModal: Modal<{
  type: "activity" | "tag"
  title?: string
  RenderBelowTitle?: ReactNode
  filters?: Filters
  onClick: (tag: Tag) => void
}> = ({ type, title, RenderBelowTitle, onClick, filters, closeModal }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const { EditModeProvider } = useEditModeProvider()

  const CardListComponent = type === "activity" ? ActivityCardList : TagCardList

  return (
    <Card
      tw="p-0 overflow-hidden"
      css={css`
        width: min-content;
        max-height: inherit;
      `}
    >
      <div tw="mx-4 my-4 space-y-4">
        {title && <div tw="text-center text-lg font-bold">{title}</div>}
        {RenderBelowTitle}
        <TextField
          name="searchBox"
          placeholder={"Search"}
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>
      <div
        tw="h-full overflow-scroll"
        css={css`
          min-height: 100%;
          height: 100%;
        `}
      >
        <EditModeProvider>
          <CardListComponent
            tw="px-4 pb-6"
            config={{
              singleColumn: true,
              filters: { ...filters, byName: searchTerm },
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
