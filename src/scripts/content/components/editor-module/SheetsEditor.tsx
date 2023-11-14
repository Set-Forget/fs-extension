import React, { useEffect, useRef } from 'react'
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
import '@/lib/codemirror-5.65.15/addon/comment/comment.js'

const SheetsEditor = ({ themeName }) => {
    const editorRef = useRef(null)
    const editorInstance = useRef(null)

    // Initialize CodeMirror instance
    useEffect(() => {
        if (window.CodeMirror && editorRef.current && !editorInstance.current) {
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
                    "Tab": "indentMore", 
                    "Shift-Tab": "indentLess",
                    "Ctrl-/": "toggleComment", // windows
                    "Cmd-/": "toggleComment", // macOS
                },
            })
        }

        // Cleanup function
        return () => {
            if (editorInstance.current && typeof editorInstance.current.toTextArea === 'function') {
                editorInstance.current.toTextArea()
            }
        }
    }, [])

    // Update theme dynamically
    useEffect(() => {
        if (editorInstance.current) {
            editorInstance.current.setOption('theme', themeName)
        }
    }, [themeName]) // This effect runs when themeName changes

    // Determine which theme styles to apply
    // Determine which theme styles to apply
    const getThemeStyles = () => {
        const themeStyles =
            themeName === 'monokai' ? monokaiThemeStyles.toString() : paraisoLightStyles.toString()
        console.log(themeStyles)
        return themeStyles
    }

    return (
        <div className="w-full h-full">
            <div ref={editorRef} className="w-full h-full p-8" />
            {/* Apply the correct theme styles */}
            <style dangerouslySetInnerHTML={{ __html: getThemeStyles() }} />
        </div>
    )
}

export default SheetsEditor
