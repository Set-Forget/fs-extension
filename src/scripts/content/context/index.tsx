import React, { useReducer, createContext, useMemo } from 'react'
import { contentReducer } from '../reducer'

type ContentState = {
    showPopup: boolean
    isHovered: boolean
    url: string | null
    isExpanded: boolean
    darkMode: boolean
    isFormatted: boolean
    isFetching: boolean
    copiedData: string
    contextMenu: {
        position: { x: number; y: number }
        toggled: boolean
    }
    isEditorFocused: boolean,
    errorMessage: string
    prettify: () => void
}

type ContentContextType = {
    state: ContentState
    dispatch: React.Dispatch<unknown>
}

const initialState = {
    showPopup: false,
    isHovered: false,
    url: null,
    isExpanded: false,
    darkMode: false,
    isFormatted: false,
    isFetching: false,
    isEditorFocused: false,
    copiedData: '',
    errorMessage: '',
    contextMenu: {
        position: { x: 0, y: 0 },
        toggled: false
    },
    prettify: () => {}
}

export const ContentContext = createContext<ContentContextType>({
    state: initialState,
    dispatch: () => null
})

export const ContentProvider = ({ children }) => {
    const [state, dispatch] = useReducer(contentReducer, initialState)

    const contextValue = useMemo(() => ({ state, dispatch }), [state])

    return <ContentContext.Provider value={contextValue}>{children}</ContentContext.Provider>
}
