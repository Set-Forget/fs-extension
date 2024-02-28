import React from 'react'
import GoogleBtn from './GoogleBtn'

const Login = () => {
    return (
        <div className="p-6">
            <h2 className="mb-2 text-xl text-center font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                Log in
            </h2>
            <div className="mt-6 flex w-full justify-center">
                <GoogleBtn />
            </div>
        </div>
    )
}

export default Login
