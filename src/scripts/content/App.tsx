import React, { useEffect, useState } from 'react'
import FloatingBtn from './components/popup-module/FloatingBtn'
import '../../lib/codemirror-5.65.15/lib/codemirror.css'

const App = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleIsOpen = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        console.log('Formula Studio: Loaded')

        const currentUrl = new URL(window.location.href)
        let simplifiedUrl = ''

        if (currentUrl.hostname.includes('docs.google.com')) {
            simplifiedUrl = 'docs.google.com'
        } else if (currentUrl.hostname.includes('notion.so')) {
            simplifiedUrl = 'notion.so'
        } else if (currentUrl.hostname.includes('onedrive.live.com')) {
            simplifiedUrl = 'onedrive.live.com'
        }

        console.log('simplified url', simplifiedUrl)
        sessionStorage.setItem('currentUrl', simplifiedUrl)

        setIsOpen(true)
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('Message Received', request, sender, sendResponse)
        })
    }, [])

    return (
        <>
            {isOpen && (
                <div className="z-[9999] fixed bottom-10 right-10 p-6 cursor-pointer opacity-[98%]">
                    <FloatingBtn />
                </div>
            )}
        </>
    )
}

export default App
