/** @jsx jsx */
import { Global, jsx } from "@emotion/core"
import { ActiveTimeSpan } from "components/ActiveTimeSpan"
import { ActivitySection } from "components/ActivitySection"
import { SecondaryButton } from "components/SecondaryButton"
import { TagTable } from "components/TagTable"
import { TimeSpanTable } from "components/TimeSpanTable"
import store, { persistor } from "redux/redux/store"
import { FC } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Provider as ReduxProvider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { globalStyle } from "styling/Themes"
import "tailwindcss/dist/base.css"
import "twin.macro"

export const App: FC = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={"loading..."} persistor={persistor}>
        <DndProvider backend={HTML5Backend}>
          <div tw="grid gap-8 p-8">
            <Global styles={globalStyle} />
            <ActiveTimeSpan />
            <ActivitySection />
            <TagTable />
            <TimeSpanTable />
            <SecondaryButton
              text="Clear localStorage"
              onClick={() => localStorage.removeItem("persist:root")}
            />
          </div>
        </DndProvider>
      </PersistGate>
    </ReduxProvider>
  )
}

export default App
