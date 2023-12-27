import React, { useState } from 'react'
import InfoModal from './InfoModal'
import { CompactIcon, ExpandIcon, FormatterIcon, HelpIcon, MoonIcon, SunIcon } from './NavbarIcons'

const InternalNavbar = ({
    darkMode,
    toggleDarkMode,
    onExpandToggle,
    isExpanded,
    prettify,
    setIsFormatted,
    isFormatted
}) => {
    const [showInfoModal, setShowInfoModal] = useState(false)
    const dm = darkMode

    return (
        <div className="fixed inset-x-0 bottom-0 z-10 w-full h-12 flex justify-between items-center px-8">
            <div
                onMouseEnter={() => setShowInfoModal(true)}
                onMouseLeave={() => setShowInfoModal(false)}
            >
                <HelpIcon darkMode={darkMode} />
                <InfoModal show={showInfoModal} dm={dm} />
            </div>

            <div className="space-x-8">
                <button>
                    <FormatterIcon darkMode={darkMode} addPrettify={addPrettify} />
                </button>

                <button onClick={toggleDarkMode}>{darkMode ? <SunIcon /> : <MoonIcon />}</button>

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

    function addPrettify() {
        prettify()
        setIsFormatted(!isFormatted)
    }
}

export default InternalNavbar
