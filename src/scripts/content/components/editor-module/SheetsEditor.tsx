import React, { useEffect, useRef, useState } from 'react'
import SpreadsheetHint from './SpreadsheetsHint'
import CopyButton from './CopyButton'
import '@/lib/codemirror-5.65.15/lib/codemirror.js'
import '@/lib/codemirror-5.65.15/mode/spreadsheet/spreadsheet.js'

import monokaiThemeStyles from '../../../../lib/codemirror-5.65.15/theme/monokai.css?inline'
import paraisoLightStyles from '../../../../lib/codemirror-5.65.15/theme/paraiso-light.css?inline'

import '@/lib/codemirror-5.65.15/addon/hint/show-hint.js'
import '@/lib/codemirror-5.65.15/addon/hint/anyword-hint.js'
import showHintStyles from '../../../../lib/codemirror-5.65.15/addon/hint/show-hint.css?inline'
import '@/lib/codemirror-5.65.15/addon/edit/closebrackets.js'
import '@/lib/codemirror-5.65.15/addon/edit/matchbrackets.js'
import '@/lib/codemirror-5.65.15/addon/selection/active-line.js'

import { OpenAI } from '../../../../lib/openai/bundled_openai.js'

window.CodeMirror.registerHelper('hint', 'spreadsheet', SpreadsheetHint)

const SheetsEditor = ({ themeName }) => {
    const editorRef = useRef(null)
    const editorInstance = useRef(null)
    const [errorMessage, setErrorMessage] = useState('')

    const apiKey = import.meta.env.VITE_GPTKEY.toString()

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

    // determine which theme styles to apply
    const getCombinedStyles = () => {
        const combinedStyles =
            showHintStyles.toString() +
            (themeName === 'monokai'
                ? monokaiThemeStyles.toString()
                : paraisoLightStyles.toString())
        return combinedStyles
    }

    // copies content of editor to clipboard
    const copyToClipboard = () => {
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

    // handle gpt prompt from editor
    const handleShiftEnter = async editor => {
        console.log('prompt sent')

        const currentLine = editor.getCursor().line
        const promptText = editor.getLine(currentLine)

        // TODO: remove write command text if needed before sending to gpt

        const openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        })
        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'user',
                        content:
                            'Please create a google sheet formula with the following characteristics: ' +
                            promptText +
                            ".  Please only answer back with the code of a formula, and no additional text. This implementation of gpt is for a chrome extension, and if it detects that the response includes additional text that has nothing to do with a formula, the extension will break. If for a weird reason the formula cannot be created due to code limitations, respond 'Formula could not be created'."
                    }
                ],
                model: 'gpt-4-1106-preview',
                temperature: 0.2
            })
            const responseText = completion.choices[0].message.content.trim()

            let startPosition
            // if error msg, return response in line below
            if (responseText === 'Formula could not be created') {
                setErrorMessage(responseText)
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

            const insertTextTypewriterStyle = (text, position, index = 0, delay = 30) => {
                if (index < text.length) {
                    editor.replaceRange(text[index], position)
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
            insertTextTypewriterStyle(responseText, startPosition)
        } catch (error) {
            console.error('Error with GPT:', error)
            setErrorMessage('An error occurred while fetching the formula.')
        }
    }

    // clears the editor of all content (might need a warning)
    const handleClearEditor = cm => {
        console.log('Clear command triggered')
        cm.setValue('')
        setErrorMessage('')
    }

    // formats code
    const prettify = cm => {
        if (cm) {
            const content = cm.getValue()
            const formatted = formatFunction(content)
            cm.setValue(formatted)
        }
    }

    const formatFunction = func => {
        let indentLevel = 0
        let formattedFunc = ''
        let inString = false // To handle strings within the function

        for (let i = 0; i < func.length; i++) {
            const char = func[i]

            // Handle string literals
            if (char === '"' && (i === 0 || func[i - 1] !== '\\')) {
                inString = !inString
            }

            if (!inString) {
                if (char === '(') {
                    indentLevel++
                    formattedFunc += char + '\n' + ' '.repeat(indentLevel * 2)
                } else if (char === ')') {
                    indentLevel = Math.max(indentLevel - 1, 0)
                    formattedFunc += '\n' + ' '.repeat(indentLevel * 2) + char
                } else if (char === ',') {
                    formattedFunc += char + '\n' + ' '.repeat(indentLevel * 2)
                } else {
                    formattedFunc += char
                }
            } else {
                formattedFunc += char
            }
        }

        return formattedFunc
    }

    // Custom Enter function that handles automatic indentation for parentheses
    const customEnterFunction = cm => {
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
    return (
        <div className="w-full h-full">
            <div ref={editorRef} className="m max-w-[98%] h-full 2xl:p-2 p-1 relative">
                <CopyButton copy={copyToClipboard} />
                {errorMessage && (
                    <p className="text-center text-orange-600 animate-pulse mt-2 text-xs">
                        {errorMessage}
                    </p>
                )}
                <button onClick={() => prettify(editorInstance.current)}>Prettify</button>
            </div>

            <style dangerouslySetInnerHTML={{ __html: getCombinedStyles() }} />
        </div>
    )
}

export default SheetsEditor
