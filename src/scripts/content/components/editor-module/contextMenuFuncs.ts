export const copy = editorInstance => {
    const content = editorInstance.getSelection()
    navigator.clipboard
        .writeText(content)
        .then(() => console.log('Text copied to clipboard'))
        .catch(err => console.error('Failed to copy text: ', err))
}

export const paste = editorInstance => {
    navigator.clipboard
        .readText()
        .then(text => {
            const cursor = editorInstance.getCursor()
            editorInstance.replaceRange(text, cursor)
            console.log('Text pasted from clipboard')
        })
        .catch(err => console.error('Failed to paste text: ', err))
}
