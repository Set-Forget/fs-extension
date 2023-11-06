import React, { useState, useEffect } from 'react'
import InternalNavbar from './InternalNavbar'

const CustomPopup = ({ showPopup }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
    }, [darkMode])

    console.log(darkMode)

    const handleExpandToggle = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div
            className={`fixed bottom-36 right-16 ${
                isExpanded ? 'w-[800px] h-[1000px]' : 'w-[600px] h-[900px]'
            } bg-fswhite text-fsblack  shadow-lg rounded-lg transform transition-all duration-500 flex flex-col ${
                showPopup ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                // TODO: FIX DARK MODE
            } ${darkMode ? 'bg-[#0E100F] text-fswhite' : ''}`}
        >
            <div className="flex-grow">
                <h1 className="title text-xl font-bold text-center p-8">{`{formulastudio}`}</h1>
            </div>

            {/* Bottom Navbar */}
            <InternalNavbar
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(prevMode => !prevMode)}
                onExpandToggle={handleExpandToggle}
            />
        </div>
    )
}

export default CustomPopup