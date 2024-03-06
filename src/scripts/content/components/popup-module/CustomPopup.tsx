import React, { useState, useEffect, useContext } from 'react'
import { ContentContext } from '../../context'
import { UserContext } from '../../context/user'
import InternalNavbar from './InternalNavbar'
import SheetsEditor from '../editor-module/SheetsEditor'
import { EXCEL_URL, ONE_THOUSAND } from '@/utils/constants'
import Login from '../login-module/login'

const CustomPopup = () => {
    const { state, dispatch } = useContext(ContentContext)
    const { state: stateUser } = useContext(UserContext)

    const { showPopup, url, darkMode, isExpanded } = state
    const [positionX, setPositionX] = useState<string>('')
    const [showEditor, setShowEditor] = useState<boolean>(false)

    // Determine the theme name based on darkMode
    const themeName = darkMode ? 'midnight' : 'isotope'

    useEffect(() => {
        const themeClass = darkMode ? 'dark' : 'light'
        document.body.classList.remove('dark', 'light')
        document.body.classList.add(themeClass)
    }, [darkMode])
    

    useEffect(() => {
        setShowEditor(Boolean(stateUser?.userIdExists))
    }, [stateUser])

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
            {showEditor ? (
                <>
                    <SheetsEditor themeName={themeName} />
                    <InternalNavbar onExpandToggle={handleExpandToggle} />
                </>
            ) : (
                <Login />
            )}
        </div>
    )

    function handleExpandToggle() {
        if (!isExpanded && Number(positionX) > ONE_THOUSAND) return
        dispatch({ type: 'TOGGLE_EXPANDED' })
    }

    function dragEnd(ev) {
        const clientX = ev.clientX
        const windowWidth = window.innerWidth
        const componentWidth = isExpanded ? 530 : 378
        const newPositionX = Math.min(
            Math.max(windowWidth - clientX, 0),
            windowWidth - componentWidth
        )
        setPositionX(`${newPositionX}`)
    }
}

export default CustomPopup
