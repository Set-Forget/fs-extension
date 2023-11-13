// import React, { useEffect, useRef } from 'react';
// import { EditorState } from '@/utils/Libraries';
// import { EditorView } from '@/utils/Libraries';
// import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@/utils/Libraries';
// import { defaultKeymap, history, historyKeymap } from '@/utils/Libraries';
// import { javascript } from '@/utils/Libraries';
// import { bracketMatching, defaultHighlightStyle, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting } from '@/utils/Libraries';
// import { lintKeymap } from '@/utils/Libraries';
// import { highlightSelectionMatches, searchKeymap } from '@/utils/Libraries';
// import { crosshairCursor, drawSelection, dropCursor, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from '@/utils/Libraries';
// import {spreadsheet} from "@/utils/Libraries";


// interface CodeMirrorEditorProps {
//   initialDoc?: string;
// }

// const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({ initialDoc = 'console.log("hello, world")' }) => {
//   const editorRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (editorRef.current) {
//       const startState = EditorState.create({
//         doc: initialDoc,
//         extensions: [
//           lineNumbers(),
//           highlightActiveLineGutter(),
//           highlightSpecialChars(),
//           history(),
//           foldGutter(),
//           drawSelection(),
//           dropCursor(),
//           EditorState.allowMultipleSelections.of(true),
//           indentOnInput(),
//           syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
//           bracketMatching(),
//           closeBrackets(),
//           autocompletion(),
//           rectangularSelection(),
//           crosshairCursor(),
//           highlightActiveLine(),
//           highlightSelectionMatches(),
//           keymap.of([
//             ...closeBracketsKeymap,
//             ...defaultKeymap,
//             ...searchKeymap,
//             ...historyKeymap,
//             ...foldKeymap,
//             ...completionKeymap,
//             ...lintKeymap,
//           ]),
//           javascript(),
//         ],
//       });

//       const view = new EditorView({
//         state: startState,
//         parent: editorRef.current,
//       });

//       return () => {
//         view.destroy();
//       };
//     }
//   }, [initialDoc]);

//   return <div ref={editorRef} />;
// };

// export default CodeMirrorEditor;

