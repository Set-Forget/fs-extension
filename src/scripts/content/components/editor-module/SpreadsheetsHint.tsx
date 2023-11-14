// // SpreadsheetHint.js
// import spreadsheetFunctions from './en-US.json'; // Import the JSON array

// const SpreadsheetHint = (editor) => {
//     const cursor = editor.getCursor();
//     const token = editor.getTokenAt(cursor);
//     const start = token.start;
//     const end = cursor.ch;
//     const currentWord = token.string.toUpperCase();

//     const list = spreadsheetFunctions.filter(function(item) {
//         // Check if the function starts with the currently typed word, case-insensitive
//         return item.toUpperCase().startsWith(currentWord);
//     });

//     return {
//         list: list.length ? list : [],
//         from: window.CodeMirror.Pos(cursor.line, start),
//         to: window.CodeMirror.Pos(cursor.line, end)
//     };
// };

// export default SpreadsheetHint;
