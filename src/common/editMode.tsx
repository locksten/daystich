/** @jsx jsx */
import { jsx } from "@emotion/core"
import { createContext, FC, useState, useContext } from "react"

const EditModeContext = createContext({
  isEditMode: false,
  enterEditMode: () => {},
  exitEditMode: () => {},
  toggleEditMode: () => {},
})

export const useEditMode = () => {
  return useContext(EditModeContext)
}

export const useEditModeProvider = (initialState = false) => {
  const [isEditMode, setIsEditMode] = useState(initialState)
  const enterEditMode = () => setIsEditMode(true)
  const exitEditMode = () => setIsEditMode(false)
  const toggleEditMode = isEditMode ? exitEditMode : enterEditMode

  const EditModeProvider: FC<{}> = ({ children }) => {
    return (
      <EditModeContext.Provider
        value={{
          isEditMode,
          enterEditMode,
          exitEditMode,
          toggleEditMode,
        }}
      >
        {children}
      </EditModeContext.Provider>
    )
  }

  return {
    EditModeProvider,
    isEditMode,
    enterEditMode,
    exitEditMode,
    toggleEditMode,
  }
}
