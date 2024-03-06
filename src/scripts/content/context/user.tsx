import { API_URL } from '@/utils/constants'
import React, { createContext, useReducer, useMemo, useEffect, useCallback } from 'react'
import { userReducer } from '../reducer/user'

type UserState = {
    email: string
    id: string
    userIdExists: boolean
    isRegistering: boolean
}

type UserContextType = {
    state: UserState
    dispatch: React.Dispatch<unknown>
}

const initialState = {
    email: '',
    id: '',
    userIdExists: false,
    isRegistering: false
}

export const UserContext = createContext<UserContextType>({
    state: initialState,
    dispatch: () => null
})

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState)
    const checkUser = useCallback(async () => {
        if (!state.id) return
        const url = `${API_URL}?action=getUserById&userId=${state.id}`
        try {
            const response = await fetch(url, {
                redirect: 'follow',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                }
            })
            const resJson = await response.json()
            return resJson
        } catch (error) {
            console.error(error)
        }
    }, [state.id])

    useEffect(() => {
        const fetchCheckUser = async () => {
            const value = await checkUser()
            if (!value) return
            const { userIdExists } = value
            dispatch({ type: 'SET_ID_EXIST', payload: userIdExists })
        }
        fetchCheckUser()
    }, [checkUser])

    const contextValue = useMemo(() => ({ state, dispatch }), [state])

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}
