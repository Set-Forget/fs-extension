export const contentReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_POPUP':
            return { ...state, showPopup: !state.showPopup }
        case 'SET_HOVERED':
            return { ...state, isHovered: action.payload }
        case 'SET_URL':
            return { ...state, url: action.payload }
        case 'TOGGLE_EXPANDED':
            return { ...state, isExpanded: !state.isExpanded }
        case 'TOGGLE_DARK_MODE':
            return { ...state, darkMode: !state.darkMode }
        case 'SET_FORMATTED':
            return { ...state, isFormatted: action.payload }
        case 'SET_FETCHING':
            return { ...state, isFetching: action.payload }
        case 'SET_EDITOR_CONTENT':
            return { ...state, editorContent: action.payload }
        case 'SET_EDITOR_FORMAT_CONTENT':
            return { ...state, editorFormatContent: action.payload }
        case 'SET_PRETTIFY':
            return { ...state, prettify: action.payload }
        case 'SET_COPIED_DATA':
            return { ...state, copiedData: action.payload }
        case 'SET_ERROR_MESSAGE':
            return { ...state, errorMessage: action.payload }
        case 'SET_CONTEXT_MENU_POSITION':
            return {
                ...state,
                contextMenu: { ...state.contextMenu, position: action.payload }
            }
        case 'TOGGLE_CONTEXT_MENU':
            return {
                ...state,
                contextMenu: { ...state.contextMenu, toggled: action.payload }
            }
        case 'RESET_EDITOR_STATE':
            return {
                ...state,
                editorContent: '',
                editorFormatContent: '',
                isFormatted: false
            }
        default:
            return state
    }
}
