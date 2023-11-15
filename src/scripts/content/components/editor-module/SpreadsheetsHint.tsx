// SpreadsheetHint.js
import spreadsheetFunctions from './en-US.json'; // Import the JSON array

const SpreadsheetHint = (editor) => {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const start = token.start;
    const end = cursor.ch;
    const currentWord = token.string.toUpperCase();

    console.log("Current word: ", currentWord); 

    const list = spreadsheetFunctions.filter(function(item) {
        return item.toUpperCase().startsWith(currentWord);
    });

    console.log("Suggestions: ", list); 

    return {
        list: list.length ? list : [],
        from: window.CodeMirror.Pos(cursor.line, start),
        to: window.CodeMirror.Pos(cursor.line, end)
    };
};


export default SpreadsheetHint;
