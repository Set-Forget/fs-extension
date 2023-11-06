import React, { useEffect, useState } from 'react'
import FloatingBtn from './components/popup-module/FloatingBtn'

const App = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleIsOpen = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        console.log('Gimme: App.jsx')
        setIsOpen(true)
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('Gimme: Message Received', request, sender, sendResponse)
        })
    }, [])

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-10 right-10 p-6 cursor-pointer">
                    <FloatingBtn/>
                </div>
            )}
        </>
    )
}

export default App