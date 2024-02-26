import React from 'react'

const InputEmail = ({email, setEmail}) => {
    
    return (
        <div>
            <label
                htmlFor="email"
                className="block text-[14px] leading-6 text-neutral-800 dark:text-neutral-50"
            >
                Email
            </label>
            <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChangeEmail}
                required
                className="mt-1 px-4 text-[14px] block w-full focus-visible:outline-none rounded-full border py-1.5 shadow-sm text-neutral-800 dark:text-neutral-50 sm:text-sm sm:leading-6 bg-transparent"
            />
        </div>
    )

    function handleChangeEmail(e) {
        setEmail(e.target.value)
    }
}

export default InputEmail
