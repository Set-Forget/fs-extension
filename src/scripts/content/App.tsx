import React, { useEffect, useState } from 'react'
import FloatingBtn from './components/popup-module/FloatingBtn'
import '../../lib/codemirror-5.65.15/lib/codemirror.css'
import { EXCEL_URL, GOOGLE_URL, NOTION_URL } from '@/utils/constants'

const App = () => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        console.log('Formula Studio: Loaded')

        const currentUrl = new URL(window.location.href)
        let simplifiedUrl = ''

        if (currentUrl.hostname.includes(GOOGLE_URL)) {
            simplifiedUrl = GOOGLE_URL
        } else if (currentUrl.hostname.includes(NOTION_URL)) {
            simplifiedUrl = NOTION_URL
        } else if (currentUrl.hostname.includes(EXCEL_URL)) {
            simplifiedUrl = EXCEL_URL
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
