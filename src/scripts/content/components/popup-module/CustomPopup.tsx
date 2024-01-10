import React, { useState, useEffect, useContext } from 'react'
import { ContentContext } from '../../context'
import InternalNavbar from './InternalNavbar'
import SheetsEditor from '../editor-module/SheetsEditor'
import { EXCEL_URL, ONE_HUNDRED, ONE_THOUSAND } from '@/utils/constants'

const CustomPopup = () => {
    const { state, dispatch } = useContext(ContentContext)
    const { showPopup, url, darkMode, isExpanded } = state
    const [positionX, setPositionX] = useState<string>('')

    // Determine the theme name based on darkMode
    const themeName = darkMode ? 'midnight' : 'isotope'

    useEffect(() => {
        const themeClass = darkMode ? 'dark' : 'light'
        document.body.classList.remove('dark', 'light')
        document.body.classList.add(themeClass)
    }, [darkMode])

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
            <SheetsEditor themeName={themeName} />
            <InternalNavbar onExpandToggle={handleExpandToggle} />
        </div>
    )

    function handleExpandToggle() {
        if (!isExpanded && Number(positionX) > ONE_THOUSAND) return
        dispatch({ type: 'TOGGLE_EXPANDED' })
    }

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
