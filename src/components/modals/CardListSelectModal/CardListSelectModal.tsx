/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { useEditModeProvider } from "common/editMode"
import { Card } from "components/Card"
import { ActivityCardList } from "components/CardList/ActivityCardList"
import { Filters } from "components/CardList/filters"
import { TagCardList } from "components/CardList/TagCardList"
import { Modal, useModal } from "components/modals/Modal"
import { TextField } from "components/TextField"
import { ReactNode, useState } from "react"
import "twin.macro"
import { Activity } from "redux/ducks/activity/types"
import { Tag } from "redux/ducks/tag/types"

type Props = (
  | {
      type: "activity"
      onClick: (activity: Activity) => void
    }
  | {
      type: "tag"
      onClick: (tag: Tag) => void
    }
) & {
  title?: string
  RenderBelowTitle?: ReactNode
  filters?: Filters
}

export const CardListSelectModal: Modal<Props> = ({
  type,
  title,
  RenderBelowTitle,
  onClick,
  filters,
  closeModal,
}) => {
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
              onLeafClick: (actag: any) => {
                closeModal()
                onClick(actag)
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
