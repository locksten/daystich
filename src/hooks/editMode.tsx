/** @jsx jsx */
import { jsx } from "@emotion/core"
import { createContext, FC, useState, useContext } from "react"

const EditModeContext = createContext({
  editMode: false,
  enterEditMode: () => {},
  exitEditMode: () => {},
  toggleEditMode: () => {},
})

export const useEditMode = () => {
  return useContext(EditModeContext)
}

export const useEditModeProvider = (initialState = false) => {
  const [editMode, setEditMode] = useState(initialState)
  const enterEditMode = () => setEditMode(true)
  const exitEditMode = () => setEditMode(false)
  const toggleEditMode = editMode ? exitEditMode : enterEditMode

  const EditModeProvider: FC<{}> = ({ children }) => {
    return (
      <EditModeContext.Provider
        value={{
          editMode,
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
    editMode,
    enterEditMode,
    exitEditMode,
    toggleEditMode,
  }
}
