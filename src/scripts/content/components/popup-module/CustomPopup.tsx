import React, { useState, useEffect } from 'react'
import InternalNavbar from './InternalNavbar'
import SheetsEditor from '../editor-module/SheetsEditor'

const CustomPopup = ({ showPopup }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [darkMode, setDarkMode] = useState(false)

    // Determine the theme name based on darkMode
    const themeName = darkMode ? 'monokai' : 'paraiso-light';

    useEffect(() => {
        // Update the body class
        const themeClass = darkMode ? 'dark' : 'light';
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(themeClass);

        // Any other theme-related side effects can go here
    }, [darkMode])

    const handleExpandToggle = () => {
        setIsExpanded(!isExpanded)
    }
// bg-[#141414]
    return (
        <div
            style={{ zIndex: 9999 }}
            className={`!z-[1000] fixed 2xl:bottom-36 2xl:right-16 bottom-24 right-6 ${
                isExpanded ? 'w-[35vw] h-[85vh]' : 'w-[25vw] h-[65vh]'
            } bg-white text-fsblack  shadow-lg rounded-lg transform transition-all duration-500 flex flex-col ${
                showPopup ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            } ${darkMode ? '!bg-[#141414] !text-fswhite' : ''}`}
        >
            <div className="flex-grow">
                <h1 className="title text-xl font-bold text-center 2xl:p-8 p-1">{`{formulastudio}`}</h1>
            </div>

            {/* Pass the themeName prop to SheetsEditor */}
            <SheetsEditor themeName={themeName}/>

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
