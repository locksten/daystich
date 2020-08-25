/** @jsx jsx */
import { Global, jsx } from "@emotion/core"
import { Story } from "@storybook/react/types-6-0"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import "tailwindcss/dist/base.css"
import "twin.macro"
import { ReduxMockStoreProvider } from "../redux/mocking/mocks"
import { globalStyle } from "../styling/Themes"

export const AppDecorator = (Story: Story) => (
  <ReduxMockStoreProvider>
    <DndProvider backend={HTML5Backend}>
      <Global styles={globalStyle} />
      <Story />
    </DndProvider>
  </ReduxMockStoreProvider>
)
