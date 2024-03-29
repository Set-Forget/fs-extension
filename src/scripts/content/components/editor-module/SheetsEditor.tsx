import React, { useEffect, useRef, useContext } from 'react'
import { ContentContext } from '../../context'
import spreadsheetsHint from './SpreadsheetsHint'
import CopyButton from './CopyButton'
import '@/lib/codemirror-5.65.15/lib/codemirror.js'
import '@/lib/codemirror-5.65.15/mode/spreadsheet/spreadsheet.js'

import monokaiThemeStyles from '@/lib/codemirror-5.65.15/theme/midnight.css?inline'
import paraisoLightStyles from '@/lib/codemirror-5.65.15/theme/isotope.css?inline'

import '@/lib/codemirror-5.65.15/addon/hint/show-hint.js'
import '@/lib/codemirror-5.65.15/addon/hint/anyword-hint.js'
import showHintStyles from '@/lib/codemirror-5.65.15/addon/hint/show-hint.css?inline'
import '@/lib/codemirror-5.65.15/addon/edit/closebrackets.js'
import '@/lib/codemirror-5.65.15/addon/edit/matchbrackets.js'
import '@/lib/codemirror-5.65.15/addon/selection/active-line.js'

import ContextMenu from './ContextMenu'
import { paste } from './contextMenuFuncs'
import { CopyIcon, PasteIcon, CloseIcon, LoadingIcon } from './contextMenuIcons'
import { formatFunction, removeFormat } from './formatFuncs'
import {
    DEFAULT_ERROR_MESSAGE,
    EXCEL,
    EXCEL_URL,
    FETCH_ERROR_MESSAGE,
    GOOGLE,
    GOOGLE_URL,
    NOTION,
    NOTION_URL,
    API_KEY
} from '@/utils/constants'
import { OpenAI } from '@/lib/openai/bundled_openai.js'

window.CodeMirror.registerHelper('hint', 'spreadsheet', spreadsheetsHint)

const SheetsEditor = ({ themeName }) => {
    const { state, dispatch } = useContext(ContentContext)
    const editorRef = useRef(null)
    const editorInstance = useRef(null)
    const stateRef = useRef(null)
    const contextMenuRef = useRef(null)

    useEffect(() => {
        stateRef.current = state
    }, [state])

    useEffect(() => {
        if (!editorInstance?.current) return
        dispatch({ type: 'SET_PRETTIFY', payload: () => prettify(editorInstance.current) })
        dispatch({ type: 'SET_IS_EDITOR_FOCUSED', payload: editorInstance.current.hasFocus() })
    }, [editorInstance.current])

    useEffect(() => {
        if (!editorInstance?.current) return
        editorInstance.current.setOption('theme', themeName)
    }, [themeName])

    useEffect(() => {
        if (!editorInstance?.current || !state.showPopup) return
        editorInstance.current.focus()
    }, [editorInstance?.current, state.showPopup])

    // Initialize CodeMirror instance
    useEffect(() => {
        if (editorInstance?.current) return
        if (window.CodeMirror && editorRef?.current) {
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
            const delayAutoComplete = (cm, change) => {
                clearTimeout(cm.autoCompleteTimer)
                if (change.origin !== 'setValue') {
                    cm.autoCompleteTimer = setTimeout(() => {
                        if (!cm.state.completionActive) {
                            cm.showHint({
                                completeSingle: false,
                                hint: spreadsheetsHint,
                                container: editorRef.current
                            })
                        }
                    }, 150)
                }
            }

            const handleKeyDown = (cm, e) => {
                const isNotionOrGoogle = [NOTION_URL, GOOGLE_URL].includes(stateRef.current.url)
                if (!isNotionOrGoogle) return
                const isPasting = (e.ctrlKey || e.metaKey) && e.key === 'v'
                const isCutting = (e.ctrlKey || e.metaKey) && e.key === 'x'
                if (isPasting) {
                    const hasSelectedText = cm.getSelection()
                    if (hasSelectedText) {
                        navigator.clipboard
                            .readText()
                            .then(text => {
                                cm.replaceSelection(text)
                                console.log('Text pasted from clipboard')
                            })
                            .catch(err => console.error('Failed to paste text: ', err))
                    } else {
                        navigator.clipboard
                            .readText()
                            .then(text => {
                                const cursor = cm.getCursor()
                                cm.replaceRange(text, cursor)
                                console.log('Text pasted from clipboard')
                            })
                            .catch(err => console.error('Failed to paste text: ', err))
                    }
                    e.stopPropagation()
                    e.preventDefault()
                    return
                }
                if (isCutting) {
                    const data = editorInstance.current.getValue()
                    navigator.clipboard.writeText(data)
                    cm.setValue('')
                    return
                }
                if (stateRef.current.url === GOOGLE_URL) {
                    const isUndoing = (e.ctrlKey || e.metaKey) && e.key === 'z'
                    const isForwarding = (e.ctrlKey || e.metaKey) && e.key === 'y'
                    if (isUndoing || isForwarding) {
                        e.stopPropagation()
                    }
                }
                if (stateRef.current.url === NOTION_URL) {
                    const isSpace = e.key === ' '
                    if (isSpace) {
                        const cursor = cm.getCursor()
                        cm.replaceRange(' ', cursor)
                    }
                }
            }

            editorInstance.current.on('inputRead', delayAutoComplete)
            editorInstance.current.on('keydown', handleKeyDown)

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

    return (
        <div className="w-full h-full relative" onContextMenu={handleContextMenu}>
            <div
                ref={editorRef}
                className="codeMirror max-w-[98%] h-full 2xl:p-2 p-1 relative cursor-default"
                onClick={handleClickEditor}
            >
                <CopyButton copy={() => copyToClipboard(editorInstance.current)} />
                {state.isFetching && (
                    <span className="flex justify-center m-2 text-sm text-blue-600 transition ease-in-out duration-150">
                        <LoadingIcon />
                        Processing...
                    </span>
                )}
                {state.errorMessage && !state.isFetching && (
                    <p className="text-center text-orange-600 animate-pulse m-2 text-sm">
                        {state.errorMessage}
                    </p>
                )}
                <ContextMenu
                    rightClickItem={'change'}
                    contextMenuRef={contextMenuRef}
                    buttons={[
                        {
                            text: 'Copy',
                            icon: <CopyIcon />,
                            onClick: () => copyToClipboard(editorInstance.current),
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
                                dispatch({ type: 'TOGGLE_CONTEXT_MENU', payload: false }),
                            isSpacer: false
                        }
                    ]}
                />
            </div>
            <style dangerouslySetInnerHTML={{ __html: getCombinedStyles() }} />
        </div>
    )

    function handleClickEditor() {
        if (stateRef.current.isEditorFocused) return
        dispatch({ type: 'SET_IS_EDITOR_FOCUSED', payload: true })
    }

    async function handleShiftEnter(editor) {
        const { isFetching: fetching } = stateRef.current
        if (fetching) return
        dispatch({ type: 'SET_FETCHING', payload: true })
        dispatch({ type: 'RESET_EDITOR_STATE' })
        const currentLine = editor.getCursor().line
        const promptText = editor.getLine(currentLine)
        const finalPrompt = getPrompt(promptText)
        const openai = new OpenAI({
            apiKey: API_KEY,
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
            let startPosition = null

            if (responseText === DEFAULT_ERROR_MESSAGE) {
                dispatch({ type: 'SET_ERROR_MESSAGE', payload: responseText })
                return
            } else {
                dispatch({ type: 'SET_ERROR_MESSAGE', payload: '' })
                startPosition = { line: currentLine, ch: 0 }
                editor.replaceRange(
                    '',
                    { line: currentLine, ch: 0 },
                    { line: currentLine + 1, ch: 0 }
                )
            }
            // add content with typewriter effect
            insertTextTypewriterStyle(cleanedResponse, startPosition)
        } catch (error) {
            dispatch({
                type: 'SET_ERROR_MESSAGE',
                payload: FETCH_ERROR_MESSAGE
            })
        } finally {
            dispatch({ type: 'SET_FETCHING', payload: false })
        }
    }

    function getPrompt(promptText) {
        const { url: currentUrl } = stateRef.current
        let platformName = ''
        switch (currentUrl) {
            case GOOGLE_URL:
                platformName = GOOGLE
                break
            case EXCEL_URL:
                platformName = EXCEL
                break
            case NOTION_URL:
                platformName = NOTION
                break
            default:
                return platformName
        }

        return `Please create a ${platformName} formula with the following characteristics: ${promptText}. Only answer back with the code of a formula, and no additional text, because if my google extension app detects additional text, the app will break. If the formula cannot be created, please answer ${DEFAULT_ERROR_MESSAGE}`
    }

    function insertTextTypewriterStyle(text, position, index = 0, delay = 25) {
        if (index < text.length) {
            if (!position) return
            editorInstance.current.replaceRange(text[index], position)
            let nextPosition = { ...position, ch: position.ch + 1 }
            if (text[index] === '\n') {
                nextPosition = { line: position.line + 1, ch: 0 }
            }
            setTimeout(() => {
                insertTextTypewriterStyle(text, nextPosition, index + 1, delay)
            }, delay)
        } else {
            prettify(editorInstance.current)
        }
    }

    function cleanGPTResponse(response) {
        const lines = response.split('\n')
        const cleanedLines = lines.filter(line => !line.trim().startsWith('```'))
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
            // Use the editor's indent unit
            const baseIndent = ' '.repeat(cm.getOption('indentUnit'))
            // Additional indentation for the new line
            const additionalIndent = ' '.repeat(2)
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
        cm.setValue('')
        dispatch({ type: 'SET_ERROR_MESSAGE', payload: '' })
        dispatch({ type: 'RESET_EDITOR_STATE' })
    }

    // format code
    function prettify(cm) {
        if (!cm) return
        const { isFormatted } = stateRef.current
        const content = cm.getValue()
        if (!content) return
        if (isFormatted) {
            const unformatted = removeFormat(content)
            dispatch({ type: 'SET_FORMATTED', payload: false })
            cm.setValue(unformatted)
        } else {
            const formatted = formatFunction(content)
            dispatch({ type: 'SET_FORMATTED', payload: true })
            cm.setValue(formatted)
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
        dispatch({ type: 'SET_CONTEXT_MENU_POSITION', payload: { x, y } })
        dispatch({ type: 'TOGGLE_CONTEXT_MENU', payload: true })
    }

    // copies content of editor to clipboard
    function copyToClipboard(editor) {
        const data = editor.getValue()
        if (!data) return
        const formatData = removeFormat(data)
        navigator.clipboard.writeText(formatData)
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
