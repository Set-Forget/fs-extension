import React, { useEffect, useRef } from 'react'
import '../../../../lib/codemirror-5.65.15/lib/codemirror.css'
// import '../../../../lib/codemirror-5.65.15/theme/monokai.css'
// import '../../../../lib/codemirror-5.65.15/theme/duotone-light.css'
import '@/lib/codemirror-5.65.15/lib/codemirror.js'
import '@/lib/codemirror-5.65.15/mode/spreadsheet/spreadsheet.js'

const SheetsEditor = ({darkMode}) => {
    const editorRef = useRef(null)

    useEffect(() => {
        if (window.CodeMirror && editorRef.current) {
            const editor = window.CodeMirror(editorRef.current, {
                lineNumbers: true,
                mode: 'spreadsheet'
            })
        }
    }, [])

    return (
        <div className="w-full h-full">
            <div ref={editorRef} className="w-full h-full p-8" />
        </div>
    )
}

export default SheetsEditor
