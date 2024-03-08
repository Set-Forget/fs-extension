import React, { useContext, useEffect } from 'react'
import { UserContext } from '../../context/user'
import { API_URL } from '@/utils/constants'
import logoImage from '../../../../assets/logofs.png'

const Login = () => {
    const { state, dispatch } = useContext(UserContext)

    const logofsImagePath = logoImage

    useEffect(() => {
        if (!state?.isRegistering) return
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                if (!state?.id) return
                const url = `${API_URL}?action=getUserById&userId=${state.id}`
                try {
                    const response = await fetch(url, {
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'text/plain;charset=utf-8'
                        }
                    })
                    const resJson = await response.json()
                    if (!resJson) return
                    const { userIdExists } = resJson
                    dispatch({ type: 'SET_ID_EXIST', payload: userIdExists })
                } catch (error) {
                    console.error(error)
                } finally {
                    dispatch({ type: 'SET_IS_REGISTERING', payload: false })
                }
            }
        }

        window.addEventListener('visibilitychange', handleVisibilityChange)
        return () => window.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [state?.isRegistering, state?.id])

    return (
        <div className="p-6 flex flex-col h-full justify-center items-center gap-y-8">
            <img alt="logo" src={logofsImagePath} width={100} height={100} />
            <div>
                <h2 className="mb-2 text-[16px] text-center font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                    Welcome,&nbsp;{state?.email}
                </h2>
                <div className="mt-4 flex flex-col justify-center items-center w-full">
                    <p className="text-[16px] mb-2">It seems you haven't created an account yet</p>
                    <p className="text-[16px]">
                        Create one{' '}
                        <a
                            onClick={handleClick}
                            className="text-blue-500 underline"
                            target="_blank"
                            href="https://fs-website-azure.vercel.app/"
                        >
                            here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )

    function handleClick() {
        dispatch({ type: 'SET_IS_REGISTERING', payload: true })
    }
}

export default Login
