import React, { useEffect, useRef } from 'react'
import monokaiThemeStyles from '../../../../lib/codemirror-5.65.15/theme/monokai.css?inline'
import duotoneLightThemeStyles from '../../../../lib/codemirror-5.65.15/theme/duotone-light.css?inline'
import '@/lib/codemirror-5.65.15/lib/codemirror.js'
import '@/lib/codemirror-5.65.15/mode/spreadsheet/spreadsheet.js'

const SheetsEditor = ({ themeName }) => {
    const editorRef = useRef(null);
    const editorInstance = useRef(null);

    // Initialize CodeMirror instance
    useEffect(() => {
        if (window.CodeMirror && editorRef.current && !editorInstance.current) {
            editorInstance.current = window.CodeMirror(editorRef.current, {
                lineNumbers: true,
                mode: 'spreadsheet',
                theme: themeName // set initial theme
            });
        }

        // Cleanup function
        return () => {
            if (editorInstance.current && typeof editorInstance.current.toTextArea === 'function') {
                editorInstance.current.toTextArea();
            }
        };
    }, []); // Empty array means this effect runs once on mount and cleanup runs on unmount

    // Update theme dynamically
    useEffect(() => {
        if (editorInstance.current) {
            editorInstance.current.setOption('theme', themeName);
        }
    }, [themeName]); // This effect runs when themeName changes

    // Determine which theme styles to apply
    const getThemeStyles = () => {
        return themeName === 'monokai' ? monokaiThemeStyles.toString() : duotoneLightThemeStyles.toString();
    };

    return (
        <div className="w-full h-full">
            <div ref={editorRef} className="w-full h-full p-8" />
            {/* Apply the correct theme styles */}
            <style dangerouslySetInnerHTML={{ __html: getThemeStyles() }} />
        </div>
    );
};

export default SheetsEditor;
