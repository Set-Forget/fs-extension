export const userReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EMAIL':
            return { ...state, email: action.payload }
        case 'SET_ID':
            return { ...state, id: action.payload }
        case 'SET_ID_EXIST':
            return { ...state, userIdExists: action.payload }
        case 'SET_IS_REGISTERING':
            return { ...state, isRegistering: action.payload }
        default:
            return state
    }
}
