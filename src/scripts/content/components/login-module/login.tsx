import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../context/user'
import InputEmail from './InputEmail'
import { API_URL } from '@/utils/constants'
import { LoadingIcon } from '../editor-module/contextMenuIcons'

const Login = () => {
    const { setUser } = useContext(UserContext)
    const [email, setEmail] = useState('')
    const [response, setResponse] = useState()
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!response) return
        const { userExists, userData } = response
        if (!userExists) {
            setError("Couldn't find your account.")
        } else {
            setUser(userData[1])
            document.cookie = `userData=${JSON.stringify(userData[1])};`
        }
    }, [response])

    return (
        <div className="p-6">
            <InputEmail email={email} setEmail={setEmail} />
            <button
                className="flex w-full items-center text-[14px] justify-center gap-3 rounded-full mt-3 px-6 py-3 text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                onClick={handleSubmit}
                disabled={!email}
            >
                {isLoading ? (
                    <span className="flex justify-center m-2 text-blue-600 transition ease-in-out duration-150">
                        <LoadingIcon />
                        Processing...
                    </span>
                ) : (
                    <>Log In</>
                )}
            </button>
            {error && (
                <p
                    className="block text-red-400 text-[14px] text-center my-2 relative"
                    role="alert"
                >
                    {error}
                </p>
            )}
            <div className="mt-4">
                <p className="flex items-center text-[16px]">
                    If you don't have an account create&nbsp;
                    <a
                        className="text-blue-500 underline"
                        target="_blank"
                        href="https://fs-website-azure.vercel.app/"
                    >
                        here
                    </a>
                </p>
            </div>
        </div>
    )

    async function handleSubmit() {
        const isValidEmail = checkEmail()
        if (!isValidEmail) {
            setError('Invalid email.')
            return
        }
        const url = `${API_URL}?action=getUserByEmail&email=${email}`
        try {
            setIsLoading(true)
            const response = await fetch(url, {
                redirect: 'follow',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                }
            })
            const resJson = await response.json()
            if (!resJson) return
            console.log()
            setResponse(resJson)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    function checkEmail() {
        const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return regExp.test(email)
    }
}

export default Login
