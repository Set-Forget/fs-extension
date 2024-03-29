export const formatFunction = content => {
    let indentLevel = 0
    let formattedFunc = ''
    let inString = false // To handle strings within the function

    for (let i = 0; i < content.length; i++) {
        const char = content[i]

        // Handle string literals
        if (char === '"' && (i === 0 || content[i - 1] !== '\\')) {
            inString = !inString
        }

        if (!inString) {
            if (char === '(') {
                indentLevel++
                formattedFunc += char + '\n' + ' '.repeat(indentLevel * 2)
            } else if (char === ')') {
                indentLevel = Math.max(indentLevel - 1, 0)
                formattedFunc += '\n' + ' '.repeat(indentLevel * 2) + char
            } else if (char === ',') {
                formattedFunc += char + '\n' + ' '.repeat(indentLevel * 2)
            } else {
                formattedFunc += char
            }
        } else {
            formattedFunc += char
        }
    }

    return formattedFunc
}

export const removeFormat = formattedContent => {
    const regex = /\s*(,\s*[\n\r]?|\s*[\n\r]?\s*(\(|\)))/g
    let result = formattedContent.replace(regex, match => match.trim())
    result = result.replace(/(\(\s{0,})/g, '(')
    return result
}
