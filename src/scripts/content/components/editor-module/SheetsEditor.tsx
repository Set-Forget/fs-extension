import React, { useEffect, useRef } from 'react'
import SpreadsheetHint from './SpreadsheetsHint'
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
import CopyButton from './CopyButton'

window.CodeMirror.registerHelper('hint', 'spreadsheet', SpreadsheetHint)

const SheetsEditor = ({ themeName }) => {
    const editorRef = useRef(null)
    const editorInstance = useRef(null)

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
                                hint: SpreadsheetHint
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
                    'Ctrl-U': 'autocomplete'
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

    return (
        <div className="w-full h-full">
            <div ref={editorRef} className="w-full h-full 2xl:p-8 p-1 relative">
                <CopyButton copy={copyToClipboard}/>
            </div>

            <style dangerouslySetInnerHTML={{ __html: getCombinedStyles() }} />
        </div>
    )
}

export default SheetsEditor
