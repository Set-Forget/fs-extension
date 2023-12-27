import React, { useState, useEffect } from 'react'
import InternalNavbar from './InternalNavbar'
import SheetsEditor from '../editor-module/SheetsEditor'

const CustomPopup = ({ showPopup }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [isFormatted, setIsFormatted] = useState<boolean>(false)
    const [prettify, setPrettify] = useState(() => () => {})

    // Determine the theme name based on darkMode
    const themeName = darkMode ? 'midnight' : 'isotope'

    useEffect(() => {
        // Update the body class
        const themeClass = darkMode ? 'dark' : 'light'
        document.body.classList.remove('dark', 'light')
        document.body.classList.add(themeClass)

        // Any other theme-related side effects can go here
    }, [darkMode])

    const handleExpandToggle = () => {
        setIsExpanded(!isExpanded)
    }

    const handlePrettify = func => {
        setPrettify(() => func)
    }

    return (
        <div
            //TODO consider move to a const
            className={`fixed 2xl:bottom-28 2xl:right-8 bottom-24 right-3 origin-right ${
                isExpanded ? 'w-[35vw] h-[85vh]' : 'w-[25vw] h-[65vh]'
            } bg-white text-fsblack  shadow-lg rounded-lg transform transition-all duration-[400ms] flex flex-col ${
                showPopup ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
            } ${darkMode ? '!bg-[#141414] !text-fswhite' : ''}`}
        >
            {/* Pass the themeName prop to SheetsEditor */}
            <SheetsEditor
                themeName={themeName}
                isFormatted={isFormatted}
                onPrettifyFunctionReady={handlePrettify}
            />

            {/* Bottom Navbar */}
            <InternalNavbar
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(prevMode => !prevMode)}
                onExpandToggle={handleExpandToggle}
                isFormatted={isFormatted}
                setIsFormatted={setIsFormatted}
                isExpanded={isExpanded}
                prettify={prettify}
            />
        </div>
    )
}

export default CustomPopup
