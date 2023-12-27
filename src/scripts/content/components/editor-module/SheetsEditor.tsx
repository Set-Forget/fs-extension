import React, { useEffect, useRef, useState, useCallback } from 'react'
import SpreadsheetHint from './SpreadsheetsHint'
import CopyButton from './CopyButton'
import '@/lib/codemirror-5.65.15/lib/codemirror.js'
import '@/lib/codemirror-5.65.15/mode/spreadsheet/spreadsheet.js'

import monokaiThemeStyles from '../../../../lib/codemirror-5.65.15/theme/midnight.css?inline'
import paraisoLightStyles from '../../../../lib/codemirror-5.65.15/theme/isotope.css?inline'

import '@/lib/codemirror-5.65.15/addon/hint/show-hint.js'
import '@/lib/codemirror-5.65.15/addon/hint/anyword-hint.js'
import showHintStyles from '../../../../lib/codemirror-5.65.15/addon/hint/show-hint.css?inline'
import '@/lib/codemirror-5.65.15/addon/edit/closebrackets.js'
import '@/lib/codemirror-5.65.15/addon/edit/matchbrackets.js'
import '@/lib/codemirror-5.65.15/addon/selection/active-line.js'

import ContextMenu from './ContextMenu'
import { copy, paste } from './contextMenuFuncs'
import { CopyIcon, PasteIcon, CloseIcon, LoadingIcon } from './contextMenuIcons'
import { uglify, formatFunction } from './formatFuncs'
import { clearEditor, enterFunction, shiftEnter } from './editorFuncs'
import { EXCEL_URL, GOOGLE_URL, NOTION_URL } from '@/utils/constants'

window.CodeMirror.registerHelper('hint', 'spreadsheet', SpreadsheetHint)

const SheetsEditor = ({ themeName, onPrettifyFunctionReady, isFormatted }) => {
    const editorRef = useRef(null)
    const editorInstance = useRef(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [contentWithOutFormat, setContentWithOutFormat] = useState('')

    let fetching: boolean = false

    const sheetDataRef = useRef(null)

    const currentUrlRef = useRef<string | null>(null)

    const contextMenuRef = useRef(null)
    const [contextMenu, setContextMenu] = useState({
        position: {
            x: 0,
            y: 0
        },
        toggled: false
    })

    const handlePrettify = useCallback(() => {
        if (!editorInstance.current || !onPrettifyFunctionReady) return
        onPrettifyFunctionReady(() => prettify(editorInstance.current))
    }, [editorInstance.current, onPrettifyFunctionReady])

    useEffect(() => {
        handlePrettify()
    }, [handlePrettify])

    useEffect(() => {
        // Fetch URL and store in ref
        const storedUrl = sessionStorage.getItem('currentUrl')
        currentUrlRef.current = storedUrl
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://script.google.com/macros/s/AKfycbxq_83LoMXidWZBJyFyBJpPyJYAMuTXQjEzZPBFP4qFDW4TqGvovI7IGnyLnEa41WjqEg/exec'
                )
                if (!response.ok) {
                    throw new Error('No response')
                }
                const data = await response.json()
                sheetDataRef.current = data
            } catch (error) {
                console.error('Fetch error:', error)
            }
        }
        fetchData()
    }, [])

    // Initialize CodeMirror instance
    useEffect(() => {
        if (window.CodeMirror && editorRef.current && !editorInstance.current) {
            // Define a delayed autocomplete trigger function
            const delayAutoComplete = (cm, change) => {
                clearTimeout(cm.autoCompleteTimer)
                if (change.origin !== 'setValue') {
                    cm.autoCompleteTimer = setTimeout(() => {
                        if (!cm.state.completionActive) {
                            cm.showHint({
                                completeSingle: false,
                                hint: SpreadsheetHint,
                                container: editorRef.current
                            })
                        }
                    }, 150)
                }
            }

            editorInstance.current = window.CodeMirror(editorRef.current, {
                lineNumbers: true,
                mode: 'spreadsheet',
                theme: themeName,
                autoCloseBrackets: true,
                matchBrackets: true,
                electricChars: true,
                smartIndent: true,
                styleActiveLine: true,
                indentWithTabs: true,
                indentUnit: 2,
                tabSize: 2,
                extraKeys: {
                    Tab: 'indentMore',
                    'Shift-Tab': 'indentLess',
                    'Ctrl-0': handleClearEditor,
                    'Shift-Enter': handleShiftEnter,
                    Enter: customEnterFunction
                },
                hintOptions: {
                    completeSingle: false
                }
            })

            // Register the event handler
            editorInstance.current.on('inputRead', delayAutoComplete)

            // Cleanup function
            return () => {
                if (editorInstance.current) {
                    clearTimeout(editorInstance.current.autoCompleteTimer)
                    editorInstance.current.off('inputRead', delayAutoComplete)
                    editorInstance.current.toTextArea()
                }
            }
        }
    }, [])

    // update theme dynamically
    useEffect(() => {
        if (editorInstance.current) {
            editorInstance.current.setOption('theme', themeName)
        }
    }, [themeName])

    useEffect(() => {
        const closeContextMenu = () => {
            console.log('Window click detected, closing context menu')
            setContextMenu(prevContextMenu => ({ ...prevContextMenu, toggled: false }))
        }

        window.addEventListener('click', closeContextMenu)
        return () => window.removeEventListener('click', closeContextMenu)
    }, [])

    // format code
    const prettify = cm => {
        const url = currentUrlRef.current
        const content = cm.getValue()
        const IS_GOOGLE_OR_EXCEL = url === GOOGLE_URL || url === EXCEL_URL
        const haveContent = Boolean(contentWithOutFormat)

        if (cm && IS_GOOGLE_OR_EXCEL) {
            if (isFormatted && haveContent) cm.setValue(contentWithOutFormat)
            else {
                const formatted = formatFunction(content)
                cm.setValue(formatted)
                if (!haveContent) setContentWithOutFormat(formatted)
            }
        } else if (url === NOTION_URL) {
            if (isFormatted && haveContent) cm.setValue(contentWithOutFormat)
            else {
                const uglified = uglify(content)
                cm.setValue(uglified)
                if (!haveContent) setContentWithOutFormat(uglified)
            }
        }
    }

    // handle gpt prompt from editor
    const handleShiftEnter = async editor => {
        shiftEnter(
            editor,
            fetching,
            setIsFetching,
            currentUrlRef,
            setErrorMessage,
            prettify,
            isFormatted
        )
    }

    // clears the editor of all content (might need a warning)
    const handleClearEditor = cm => {
        clearEditor(cm, setErrorMessage)
    }

    // Custom Enter function that handles automatic indentation for parentheses
    const customEnterFunction = cm => {
        enterFunction(cm)
    }

    return (
        <div className="w-full h-full relative" onContextMenu={handleContextMenu}>
            <div
                ref={editorRef}
                className="m max-w-[98%] h-full 2xl:p-2 p-1 relative cursor-default"
            >
                <CopyButton copy={copyToClipboard} />
                {isFetching && (
                    <span className="flex justify-center m-2 text-sm text-blue-600 transition ease-in-out duration-150">
                        <LoadingIcon />
                        Processing...
                    </span>
                )}
                {errorMessage && (
                    <p className="text-center text-orange-600 animate-pulse mt-2 text-xs">
                        {errorMessage}
                    </p>
                )}

                <ContextMenu
                    rightClickItem={'change'}
                    contextMenuRef={contextMenuRef}
                    isToggled={contextMenu.toggled}
                    positionX={contextMenu.position.x}
                    positionY={contextMenu.position.y}
                    buttons={[
                        {
                            text: 'Copy',
                            icon: <CopyIcon />,
                            onClick: () => copy(editorInstance.current),
                            isSpacer: false
                        },
                        {
                            text: 'Paste',
                            icon: <PasteIcon />,
                            onClick: () => paste(editorInstance.current),
                            isSpacer: false
                        },
                        {
                            text: '',
                            icon: '',
                            onClick: () => null,
                            isSpacer: true
                        },
                        {
                            text: 'Close',
                            icon: <CloseIcon />,
                            onClick: () =>
                                setContextMenu(prevState => ({
                                    ...prevState,
                                    toggled: false
                                })),
                            isSpacer: false
                        }
                    ]}
                />
            </div>

            <style dangerouslySetInnerHTML={{ __html: getCombinedStyles() }} />
        </div>
    )

    function handleContextMenu(e) {
        e.preventDefault()

        const editorRect = editorRef.current.getBoundingClientRect()
        const menuWidth = contextMenuRef.current.offsetWidth
        const menuHeight = contextMenuRef.current.offsetHeight

        let x = e.clientX - editorRect.left
        let y = e.clientY - editorRect.top

        // Adjust if the menu goes off to the right
        if (x + menuWidth > editorRect.width) {
            x -= x + menuWidth - editorRect.width
        }

        // Adjust if the menu goes off to the bottom
        if (y + menuHeight > editorRect.height) {
            y -= y + menuHeight - editorRect.height
        }

        setContextMenu({
            position: { x, y },
            toggled: true
        })
    }

    // copies content of editor to clipboard
    function copyToClipboard() {
        const content = editorInstance.current && editorInstance.current.getValue()
        if (content) {
            navigator.clipboard
                .writeText(content)
                .then(() => {
                    console.log('Content copied to clipboard')
                })
                .catch(err => {
                    console.error('Could not copy text: ', err)
                })
        }
    }

    // determine which theme styles to apply
    function getCombinedStyles() {
        return (
            String(showHintStyles) +
            (themeName === 'midnight' ? String(monokaiThemeStyles) : String(paraisoLightStyles))
        )
    }
}

export default SheetsEditor
