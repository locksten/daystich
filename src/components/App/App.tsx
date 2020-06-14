/** @jsx jsx */
import { Global, jsx } from "@emotion/core"
import { ActiveTimeSpan } from "components/ActiveTimeSpan"
import { ActivityList } from "components/ActivityList"
import { SecondaryButton } from "components/SecondaryButton"
import { TagTable } from "components/TagTable"
import { TimeSpanTable } from "components/TimeSpanTable"
import store, { persistor } from "ducks/redux/store"
import { FC } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { globalStyle } from "styling/Themes"
import "tailwindcss/dist/base.css"
import "twin.macro"

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
          <ActivityList tagId="NPmUg04oS8hyCYiLXRadq" />
        </div>
      </PersistGate>
    </ReduxProvider>
  )
}

export default App
