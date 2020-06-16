/** @jsx jsx */
import { Global, jsx } from "@emotion/core"
import { Id } from "common"
import { ActiveTimeSpan } from "components/ActiveTimeSpan"
import { ActivityCardList, TagCardList } from "components/ActivityList"
import { Card } from "components/Card"
import { SecondaryButton } from "components/SecondaryButton"
import { TagTable } from "components/TagTable"
import { TimeSpanTable } from "components/TimeSpanTable"
import { rootActivityId } from "ducks/redux/common"
import { useAppSelector } from "ducks/redux/rootReducer"
import store, { persistor } from "ducks/redux/store"
import { selectRootTagIds, selectTagById, selectTagColor } from "ducks/tag"
import { FC } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { globalStyle } from "styling/Themes"
import "tailwindcss/dist/base.css"
import "twin.macro"

export const Roots: FC<{}> = () => {
  const rootTagIds = useAppSelector(selectRootTagIds)
  return (
    <div tw="grid grid-flow-col gap-4 p-4">
      {rootTagIds.map((id) => (
        <Root key={id} id={id} />
      ))}
    </div>
  )
}

export const Root: FC<{ id: Id }> = ({ id }) => {
  const tag = useAppSelector((s) => selectTagById(s, id))!
  const color = useAppSelector((s) => selectTagColor(s, tag.id))
  return (
    <Card tw="text-white text-center" css={{ backgroundColor: color }}>
      {tag.name}
    </Card>
  )
}

export const App: FC = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={"loading..."} persistor={persistor}>
        <div tw="grid gap-8 p-8">
          <SecondaryButton
            text="Clear localStorage"
            onClick={() => localStorage.removeItem("persist:root")}
          />
          <Global styles={globalStyle} />
          <TagTable />
          <TimeSpanTable />
          <ActiveTimeSpan />
          <Roots />
          <div>
            ActivityList
            <ActivityCardList />
          </div>
          <div>
            ActivityListTag
            <TagCardList tagId={rootActivityId} />
          </div>
        </div>
      </PersistGate>
    </ReduxProvider>
  )
}

export default App
