import React, { useState, useContext } from 'react'
import { ContentContext } from '../../context'
import InfoModal from './InfoModal'
import { CompactIcon, ExpandIcon, FormatterIcon, HelpIcon, MoonIcon, SunIcon } from './NavbarIcons'

const InternalNavbar = ({ onExpandToggle }) => {
    const { state, dispatch } = useContext(ContentContext)
    const { prettify, darkMode, isExpanded } = state
    const [showInfoModal, setShowInfoModal] = useState(false)
    const dm = darkMode

    return (
        <div className="fixed inset-x-0 bottom-0 z-10 w-full h-12 flex justify-between items-center px-8">
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <HelpIcon darkMode={darkMode} />
                <InfoModal show={showInfoModal} dm={dm} />
            </div>

            <div className="space-x-8">
                <button>
                    <FormatterIcon darkMode={darkMode} addPrettify={addPrettify} />
                </button>

                <button onClick={handleClick}>{darkMode ? <SunIcon /> : <MoonIcon />}</button>

                <button onClick={onExpandToggle}>
                    {!isExpanded ? (
                        <ExpandIcon darkMode={darkMode} />
                    ) : (
                        <CompactIcon darkMode={darkMode} />
                    )}
                </button>
            </div>
        </div>
    )

    function handleClick() {
        dispatch({ type: 'TOGGLE_DARK_MODE' })
    }

    function handleMouseEnter() {
        setShowInfoModal(true)
    }

    function handleMouseLeave() {
        setShowInfoModal(false)
    }

    function addPrettify() {
        prettify()
    }
}

export default InternalNavbar
