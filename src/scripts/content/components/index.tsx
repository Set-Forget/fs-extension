import React, { useEffect, useContext } from 'react'
import FloatingBtn from './popup-module/FloatingBtn'
import { ContentContext } from '../context'
import { NOTION_URL } from '@/utils/constants'

const RootComponent = () => {
    const { dispatch } = useContext(ContentContext)

    useEffect(() => {
        const closeContextMenu = () => {
            dispatch({ type: 'TOGGLE_CONTEXT_MENU', payload: false })
        }

        window.addEventListener('click', closeContextMenu)
        return () => window.removeEventListener('click', closeContextMenu)
    }, [])

    useEffect(() => {
        const isNotion = sessionStorage.getItem('currentUrl') === NOTION_URL
        if (!isNotion) return
        const handleGlobalKeyDown = e => {
            const isEditor = e.target.id === 'EDITOR'
            if (!isEditor) return
            const keyCombos = {
                Enter: e.key === 'Enter',
                Backspace: e.key === 'Backspace',
                'Ctrl+X': e.ctrlKey && e.key === 'x',
                'Cmd+X': e.metaKey && e.key === 'x',
                'Ctrl+V': e.ctrlKey && e.key === 'v',
                'Cmd+V': e.metaKey && e.key === 'v',
                'Ctrl+Z': e.ctrlKey && e.key === 'z',
                'Cmd+Z': e.metaKey && e.key === 'z'
            }
            for (const combo in keyCombos) {
                if (keyCombos[combo]) {
                    e.stopPropagation()
                    e.preventDefault()
                    return
                }
            }
        }
        document.addEventListener('keydown', handleGlobalKeyDown)
        return () => window.removeEventListener('keydown', handleGlobalKeyDown)
    }, [])

    useEffect(() => {
        const handleCopy = event => {
            const data = event.clipboardData.getData('Text')
            dispatch({ type: 'SET_COPIED_DATA', payload: data })
        }

        window.addEventListener('copy', handleCopy)
        return () => window.removeEventListener('copy', handleCopy)
    }, [])

    return (
        <div className="z-[9999] fixed bottom-10 right-10 p-6 cursor-pointer opacity-[98%]">
            <FloatingBtn />
        </div>
    )
}

export default RootComponent
