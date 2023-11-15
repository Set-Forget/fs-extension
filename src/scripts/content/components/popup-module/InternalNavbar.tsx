import React from 'react'

const InternalNavbar = ({ darkMode, toggleDarkMode, onExpandToggle }) => {
    return (
        <div className="w-full h-16 flex justify-around items-center border-t border-gray-400">
            <button onClick={toggleDarkMode}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
            <button onClick={onExpandToggle}>Expand</button>
        </div>
    )
}

export default InternalNavbar