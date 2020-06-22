/** @jsx jsx */
import { jsx } from "@emotion/core"
import { TagCardList } from "components/ActivitySection/CardList"
import { Card } from "components/Card"
import { Modal, useModal } from "components/modals/Modal"
import { TextField } from "components/TextField"
import { Tag } from "ducks/tag"
import { useState } from "react"
import "twin.macro"

export const TagSelectModal: Modal<{ onClick: (tag: Tag) => void }> = ({
  onClick,
  closeModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <Card tw="p-0 max-h-full flex flex-col">
      <TextField
        tw="mx-4 my-4"
        name="searchBox"
        placeholder={"Search"}
        value={searchTerm}
        onChange={setSearchTerm}
      />
      <div tw="h-full overflow-scroll">
        <TagCardList
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
      </div>
    </Card>
  )
}

export const useTagSelectModal = () => useModal("Select tag", TagSelectModal)
