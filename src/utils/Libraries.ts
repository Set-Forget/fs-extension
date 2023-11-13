import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import {
    autocompletion,
    closeBrackets,
    closeBracketsKeymap,
    completionKeymap
} from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import {
    bracketMatching,
    defaultHighlightStyle,
    foldGutter,
    foldKeymap,
    indentOnInput,
    syntaxHighlighting
} from '@codemirror/language'
import { lintKeymap } from '@codemirror/lint'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import {
    crosshairCursor,
    drawSelection,
    dropCursor,
    highlightActiveLine,
    highlightActiveLineGutter,
    highlightSpecialChars,
    keymap,
    lineNumbers,
    rectangularSelection
} from '@codemirror/view'
import { spreadsheet } from 'codemirror-lang-spreadsheet'

export {
    EditorState,
    EditorView,
    autocompletion,
    closeBrackets,
    closeBracketsKeymap,
    completionKeymap,
    defaultHighlightStyle,
    defaultKeymap,
    history,
    historyKeymap,
    javascript,
    bracketMatching,
    foldGutter,
    foldKeymap,
    indentOnInput,
    syntaxHighlighting,
    lintKeymap,
    highlightActiveLine,
    highlightActiveLineGutter,
    highlightSpecialChars,
    highlightSelectionMatches,
    searchKeymap,
    crosshairCursor,
    drawSelection,
    dropCursor,
    keymap,
    lineNumbers,
    rectangularSelection,
    spreadsheet
}
