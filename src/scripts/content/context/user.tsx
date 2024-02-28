import { API_URL } from '@/utils/constants'
import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react'

type UserContextType = {
    user: Record<string,unknown>,
    setUser: React.Dispatch<unknown>
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => null
})

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const localData = localStorage.getItem("userData");
        return localData ? JSON.parse(localData) : "";
      });

    const fetchUserData = useCallback(async accessToken => {
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        if (!response.ok) return
        const data = await response.json()
        return data
    }, [])

    useEffect(() => {
        if (!user?.access_token || user?.id) return
        const fetchData = async () => {
            const userData = await fetchUserData(user?.access_token)
            if (!userData) return
            sessionStorage.setItem('id', userData.id)
            setUser(prev => ({ ...prev, ...userData }))
        }
        fetchData()
    }, [user?.access_token, fetchUserData, user?.id])

    const { isUserRegistered } = useUser(user)

    useEffect(() => {
        setUser(prev => ({ ...prev, isUserRegistered }))
    }, [isUserRegistered, user.id])

    const contextValue = useMemo(() => ({ user, setUser }), [user])

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

const useUser = ({ id, email, name, access_token }) => {
    const [isUserRegistered, setIsUserRegistered] = useState(false)

    const registerUser = useCallback(async () => {
        if (!id || !email || !name) return
        const url = `${API_URL}?userId=${id}&email=${email}&name=${name}&token=${access_token}`
        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                }
            })
            setIsUserRegistered(true)
        } catch (error) {
            console.error(error)
        }
    }, [id, email, name, access_token])

    const checkUser = useCallback(async () => {
        if (!id) return
        const url = `${API_URL}?action=getUserById&userId=${id}`
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
    }, [id])

    useEffect(() => {
        const fetchCheckUser = async () => {
            const value = await checkUser()
            if (!value) return
            const { userIdExists } = value
            setIsUserRegistered(userIdExists)
            if (!userIdExists) {
                await registerUser()
            }
        }
        fetchCheckUser()
    }, [id, registerUser, checkUser, setIsUserRegistered])

    return { isUserRegistered }
}
