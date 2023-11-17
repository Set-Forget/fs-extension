import React from 'react'

const CopyButton = ({ copy }) => {
    return (
        <button onClick={copy} className="z-50 absolute bottom-16 right-2 w-8 h-8 rounded-full bg-gradient-to-tr from-fsgreen to-fsapple flex items-center justify-center scale-125 hover:scale-[1.3] transition-all duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                <path className='fill-white text-white' d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
            </svg>
        </button>
    )
}

export default CopyButton
