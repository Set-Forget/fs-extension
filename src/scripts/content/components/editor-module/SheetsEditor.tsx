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
    const [errorMessage, setErrorMessage] = useState('');

    const apiKey = import.meta.env.VITE_GPTKEY.toString();

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
                                container: editorRef.current,
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
                styleActiveLine: true,
                indentWithTabs: true,
                indentUnit: 4,
                tabSize: 4,
                extraKeys: {
                    Tab: 'indentMore',
                    'Shift-Tab': 'indentLess',
                    'Ctrl-U': 'autocomplete',
                    'Shift-Enter': handleShiftEnter,
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
    const handleShiftEnter = async (editor) => {
        const currentLine = editor.getCursor().line;
        const promptText = editor.getLine(currentLine);

        // TODO: remove write command text if needed before sending to gpt

        const openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
        });
        try {
            const completion = await openai.chat.completions.create({
                messages: [{
                    role: "user", content: "Please create a google sheet formula with the following characteristics: " + promptText + ".  Please only answer back with the code of a formula, and no additional text. This implementation of gpt is for a chrome extension, and if it detects that the response includes additional text that has nothing to do with a formula, the extension will break. If for a weird reason the formula cannot be created due to code limitations, respond 'Formula could not be created'."
                }],
                model: "gpt-4",
                max_tokens: 200,
                temperature: 0.2,
            });
            const responseText = completion.choices[0].message.content.trim();
            const currentPosition = { line: currentLine, ch: 0 };
            const positionTwoLinesBelow = { line: currentLine + 2, ch: 0 };

            let startPosition;
            // if error msg, return response in line below
            if (responseText === "Formula could not be created") {
                setErrorMessage(responseText);
            } else {
                // ff the response is a formula, replace the current line
                setErrorMessage('');
                startPosition = { line: currentLine, ch: 0 };
                editor.replaceRange("", { line: currentLine, ch: 0 }, { line: currentLine + 1, ch: 0 });
            }

            const insertTextTypewriterStyle = (text, position, index = 0, delay = 30) => {
                if (index < text.length) {
                    editor.replaceRange(text[index], position);
                    let nextPosition = { ...position, ch: position.ch + 1 };
                    if (text[index] === '\n') {
                        nextPosition = { line: position.line + 1, ch: 0 };
                    }
                    setTimeout(() => {
                        insertTextTypewriterStyle(text, nextPosition, index + 1, delay);
                    }, delay);
                }
            };

            // Start position for typewriter effect
            insertTextTypewriterStyle(responseText, startPosition);
        } catch (error) {
            console.error('Error with GPT:', error);
            setErrorMessage('An error occurred while fetching the formula.');
        }
    }


    return (
        <div className="w-full h-full">
            <div ref={editorRef} className="m max-w-[98%] h-full 2xl:p-2 p-1 relative">
                <CopyButton copy={copyToClipboard} />
                {errorMessage && (
                    <p className="text-center text-orange-600 animate-pulse mt-2 text-xs">{errorMessage}</p>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: getCombinedStyles() }} />
        </div>
    )
}

export default SheetsEditor
