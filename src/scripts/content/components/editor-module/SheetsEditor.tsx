import React, { useEffect, useRef } from 'react';
import '@/lib/codemirror-5.65.15/lib/codemirror.css';
import '@/lib/codemirror-5.65.15/lib/codemirror.js';
import '@/lib/codemirror-5.65.15/mode/spreadsheet/spreadsheet.js';

const SheetsEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (window.CodeMirror && editorRef.current) {
      const editor = window.CodeMirror(editorRef.current, {
        lineNumbers: true,
        mode: 'spreadsheet'
      });
    }
  }, []);

  return <div ref={editorRef}></div>;
};

export default SheetsEditor;
