import { API_URL } from '@/utils/constants'
import React, { createContext, useState, useMemo, useEffect } from 'react'

type UserContextType = {
    user: string | null
    setUser: React.Dispatch<unknown>
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => null
})

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const cookieData = document.cookie.split('; ').find(row => row.startsWith('userData='))
        return cookieData ? JSON.parse(cookieData.split('=')[1]) : null
    })  

    console.log(user);
    
    const contextValue = useMemo(() => ({ user, setUser }), [user])

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}
