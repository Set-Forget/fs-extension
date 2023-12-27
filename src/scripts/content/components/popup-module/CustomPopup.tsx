import React, { useState, useEffect } from 'react'
import InternalNavbar from './InternalNavbar'
import SheetsEditor from '../editor-module/SheetsEditor'
import { EXCEL_URL, ONE_HUNDRED, ONE_THOUSAND } from '@/utils/constants'

const CustomPopup = ({ showPopup }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [isFormatted, setIsFormatted] = useState<boolean>(false)
    const [positionX, setPositionX] = useState<string>('')
    const [prettify, setPrettify] = useState(() => () => {})

    const url = sessionStorage.getItem('currentUrl');
    
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
        if (!isExpanded && Number(positionX) > ONE_THOUSAND) return
        setIsExpanded(!isExpanded)
    }

    const handlePrettify = func => {
        setPrettify(() => func)
    }

    const className = `fixed 2xl:bottom-28 2xl:right-8 bottom-24 right-3 origin-right ${
        isExpanded ? 'w-[35vw] h-[85vh]' : 'w-[25vw] h-[65vh]'
    } bg-white text-fsblack  shadow-lg rounded-lg transform transition-all duration-[400ms] flex flex-col ${
        showPopup ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
    } ${darkMode ? '!bg-[#141414] !text-fswhite' : ''} ${url === EXCEL_URL ? 'font-sans' : ''}`

    return (
        <div
            className={className}
            draggable
            onDragEnd={dragEnd}
            style={{ right: `${positionX}px` }}
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

    function dragEnd(ev) {
        const { clientX } = ev
        if (clientX < ONE_HUNDRED && !isExpanded) {
            setPositionX('1100')
        } else if (clientX > ONE_HUNDRED && clientX < ONE_THOUSAND) {
            setPositionX('600')
        } else if (clientX > ONE_THOUSAND) {
            setPositionX('12')
        }
        ev.dataTransfer.setData('text', ev.target.id)
    }
}

export default CustomPopup
