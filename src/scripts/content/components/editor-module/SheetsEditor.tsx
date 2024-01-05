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
import { EXCEL_URL, GOOGLE_URL, NOTION_URL } from '@/utils/constants'
import { OpenAI } from '../../../../lib/openai/bundled_openai.js'

export const apiKey = String(import.meta.env.VITE_GPTKEY)

window.CodeMirror.registerHelper('hint', 'spreadsheet', SpreadsheetHint)

const SheetsEditor = ({ themeName, onPrettifyFunctionReady, isFormatted }) => {
    const editorRef = useRef(null)
    const editorInstance = useRef(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [contentWithOutFormat, setContentWithOutFormat] = useState('')
    const copyDataRef = useRef(null)
    const fetchingRef = useRef(null)

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

            const handleKeyDown = (cm, e) => {
                const url = currentUrlRef.current
                if (url !== GOOGLE_URL) return
                const isPasting = (e.ctrlKey || e.metaKey) && e.key === 'v'
                if (!isPasting) return
                if (copyDataRef.current) cm.replaceSelection(copyDataRef.current)
            }

            // Register the event handler
            editorInstance.current.on('inputRead', delayAutoComplete)

            editorInstance.current.on('keydown', handleKeyDown)

            // Cleanup function
            return () => {
                if (editorInstance.current) {
                    clearTimeout(editorInstance.current.autoCompleteTimer)
                    editorInstance.current.off('inputRead', delayAutoComplete)
                    editorInstance.current.off('keydown', handleKeyDown)
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

    useEffect(() => {
        const handleCopy = event => {
            const data = event.clipboardData.getData('Text')
            copyDataRef.current = data
        }

        window.addEventListener('copy', handleCopy)
        return () => window.removeEventListener('copy', handleCopy)
    }, [])

    return (
        <div className="w-full h-full relative" onContextMenu={handleContextMenu}>
            <div
                ref={editorRef}
                className="m max-w-[98%] h-full 2xl:p-2 p-1 relative cursor-default"
            >
                <CopyButton copy={copyToClipboard} />
                {fetchingRef.current && (
                    <span className="flex justify-center m-2 text-sm text-blue-600 transition ease-in-out duration-150">
                        <LoadingIcon />
                        Processing...
                    </span>
                )}
                {errorMessage && !fetchingRef.current && (
                    <p className="text-center text-orange-600 animate-pulse m-2 text-sm">
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

    async function handleShiftEnter(editor) {
        if (fetchingRef.current) return
        fetchingRef.current = true
        const url = currentUrlRef.current
        const currentLine = editor.getCursor().line
        const promptText = editor.getLine(currentLine)

        const sheetsPrompt = `Please create a google sheets formula with the following characteristics: ${promptText} . Only answer back with the code of a formula, and no additional text, because if my google extension app detects additional text, the app will break. If the formula cannot be created, please answer "Formula could not be created"`
        const notionPrompt = `Please create a Notion formula with the following characteristics: ${promptText} . Only answer back with the code of a formula, and no additional text, because if my google extension app detects additional text, the app will break. If the formula cannot be created, please answer "Formula could not be created"`
        const excelOnlinePrompt = `Please create an Excel Online formula with the following characteristics: ${promptText} . Only answer back with the code of a formula, and no additional text, because if my google extension app detects additional text, the app will break. If the formula cannot be created, please answer "Formula could not be created"`
        let finalPrompt: string = ''

        if (url === GOOGLE_URL) {
            finalPrompt = sheetsPrompt
            console.log(finalPrompt)
        } else if (url === EXCEL_URL) {
            finalPrompt = excelOnlinePrompt
            console.log(finalPrompt)
        } else if (url === NOTION_URL) {
            finalPrompt = notionPrompt
            console.log(finalPrompt)
        }

        console.log('Current URL:', url)

        const openai = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true
        })
        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'user',
                        content: finalPrompt
                    }
                ],
                model: 'gpt-4-1106-preview',
                temperature: 0.1
            })
            const responseText = completion.choices[0].message.content.trim()
            const cleanedResponse = cleanGPTResponse(responseText)

            let startPosition
            // if error msg, return response in line below
            if (responseText === 'Formula could not be created') {
                setErrorMessage(responseText)
                return
            } else {
                // ff the response is a formula, replace the current line
                setErrorMessage('')
                startPosition = { line: currentLine, ch: 0 }
                editor.replaceRange(
                    '',
                    { line: currentLine, ch: 0 },
                    { line: currentLine + 1, ch: 0 }
                )
            }

            const insertTextTypewriterStyle = (text, position, index = 0, delay = 25) => {
                if (index < text.length) {
                    if (position) editor.replaceRange(text[index], position)
                    else return
                    let nextPosition = { ...position, ch: position.ch + 1 }
                    if (text[index] === '\n') {
                        nextPosition = { line: position.line + 1, ch: 0 }
                    }
                    setTimeout(() => {
                        insertTextTypewriterStyle(text, nextPosition, index + 1, delay)
                    }, delay)
                } else {
                    // After the entire text is inserted, call prettify
                    prettify(editor)
                }
            }

            // Start position for typewriter effect
            insertTextTypewriterStyle(cleanedResponse, startPosition)
        } catch (error) {
            console.error('Error with GPT:', error)
            setErrorMessage('An error occurred while fetching the formula.')
        } finally {
            fetchingRef.current = false
        }
    }

    function cleanGPTResponse(response) {
        // Split the response into lines
        const lines = response.split('\n')

        // Remove lines that contain backticks
        const cleanedLines = lines.filter(line => !line.trim().startsWith('```'))

        // Join the cleaned lines back into a single string
        return cleanedLines.join('\n')
    }

    // Custom Enter function that handles automatic indentation for parentheses
    function customEnterFunction(cm) {
        const cursor = cm.getCursor()
        const line = cm.getLine(cursor.line)
        const beforeCursor = line.slice(0, cursor.ch)
        const afterCursor = line.slice(cursor.ch)

        // Check if the cursor is between parentheses
        if (beforeCursor.endsWith('(') && afterCursor.startsWith(')')) {
            const baseIndent = ' '.repeat(cm.getOption('indentUnit')) // Use the editor's indent unit
            const additionalIndent = ' '.repeat(2) // Additional indentation for the new line

            // Insert new lines and adjust cursor position
            cm.replaceRange(
                '\n' + baseIndent + additionalIndent + '\n' + baseIndent,
                { line: cursor.line, ch: cursor.ch },
                { line: cursor.line, ch: cursor.ch }
            )

            // Set the cursor position
            cm.setCursor({ line: cursor.line + 1, ch: baseIndent.length + additionalIndent.length })
        } else {
            // Default behavior for Enter key
            cm.execCommand('newlineAndIndent')
        }
    }

    // clears the editor of all content (might need a warning)
    function handleClearEditor(cm) {
        console.log('Clear command triggered')
        cm.setValue('')
        setErrorMessage('')
    }

    // format code
    function prettify(cm) {
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
