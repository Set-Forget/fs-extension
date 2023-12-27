import { EXCEL_URL, GOOGLE_URL, NOTION_URL } from '@/utils/constants'
import { OpenAI } from '../../../../lib/openai/bundled_openai.js'

export const apiKey = String(import.meta.env.VITE_GPTKEY)

export const clearEditor = (cm, setErrorMessage) => {
    console.log('Clear command triggered')
    cm.setValue('')
    setErrorMessage('')
}

export const enterFunction = cm => {
    const cursor = cm.getCursor()
    const line = cm.getLine(cursor.line)
    const beforeCursor = line.slice(0, cursor.ch)
    const afterCursor = line.slice(cursor.ch)

    // Check if the cursor is between parentheses
    if (beforeCursor.endsWith('(') && afterCursor.startsWith(')')) {
        const baseIndent = ' '.repeat(cm.getOption('indentUnit')) // Use the editor's indent unit
        const additionalIndent = ' '.repeat(2) // Additional indentation for the new line

        // Insert new lines and adjust cursor position
        cm.replaceRange(
            '\n' + baseIndent + additionalIndent + '\n' + baseIndent,
            { line: cursor.line, ch: cursor.ch },
            { line: cursor.line, ch: cursor.ch }
        )

        // Set the cursor position
        cm.setCursor({ line: cursor.line + 1, ch: baseIndent.length + additionalIndent.length })
    } else {
        // Default behavior for Enter key
        cm.execCommand('newlineAndIndent')
    }
}

export const shiftEnter = async (
    editor,
    fetching: boolean,
    setIsFetching: (param: boolean) => void,
    currentUrlRef,
    setErrorMessage: (param: string) => void,
    prettify,
    isFormatted: boolean
) => {
    if (fetching) return
    fetching = true
    setIsFetching(true)
    const url = currentUrlRef.current
    const currentLine = editor.getCursor().line
    const promptText = editor.getLine(currentLine)

    const sheetsPrompt = `Please create a google sheets formula with the following characteristics: ${promptText} . Only answer back with the code of a formula, and no additional text, because if my google extension app detects additional text, the app will break. If the formula cannot be created, please answer "Formula could not be created".`
    const notionPrompt = `Please create a Notion formula with the following characteristics: ${promptText} . Only answer back with the code of a formula, and no additional text, because if my google extension app detects additional text, the app will break. If the formula cannot be created, please answer "Formula could not be created".`
    const excelOnlinePrompt = `Please create an Excel Online formula with the following characteristics: ${promptText} . Only answer back with the code of a formula, and no additional text, because if my google extension app detects additional text, the app will break. If the formula cannot be created, please answer "Formula could not be created".`
    let finalPrompt: string = ''

    if (url === GOOGLE_URL) {
        finalPrompt = sheetsPrompt
        console.log(finalPrompt)
    } else if (url === EXCEL_URL) {
        finalPrompt = excelOnlinePrompt
        console.log(finalPrompt)
    } else if (url === NOTION_URL) {
        finalPrompt = notionPrompt
        console.log(finalPrompt)
    }

    console.log('Current URL:', url)

    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    })
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: finalPrompt
                }
            ],
            model: 'gpt-4-1106-preview',
            temperature: 0.1
        })
        const responseText = completion.choices[0].message.content.trim()
        const cleanedResponse = cleanGPTResponse(responseText)

        let startPosition
        // if error msg, return response in line below
        if (responseText === 'Formula could not be created') {
            setErrorMessage(responseText)
        } else {
            // ff the response is a formula, replace the current line
            setErrorMessage('')
            startPosition = { line: currentLine, ch: 0 }
            editor.replaceRange('', { line: currentLine, ch: 0 }, { line: currentLine + 1, ch: 0 })
        }

        const insertTextTypewriterStyle = (text, position, index = 0, delay = 25) => {
            if (index < text.length) {
                editor.replaceRange(text[index], position)
                let nextPosition = { ...position, ch: position.ch + 1 }
                if (text[index] === '\n') {
                    nextPosition = { line: position.line + 1, ch: 0 }
                }
                setTimeout(() => {
                    insertTextTypewriterStyle(text, nextPosition, index + 1, delay)
                }, delay)
            } else {
                // After the entire text is inserted, call prettify
                prettify(editor, currentUrlRef, isFormatted)
            }
        }

        // Start position for typewriter effect
        insertTextTypewriterStyle(cleanedResponse, startPosition)
    } catch (error) {
        console.error('Error with GPT:', error)
        setErrorMessage('An error occurred while fetching the formula.')
    } finally {
        setIsFetching(false)
        fetching = false
    }
}

const cleanGPTResponse = response => {
    // Split the response into lines
    const lines = response.split('\n')

    // Remove lines that contain backticks
    const cleanedLines = lines.filter(line => !line.trim().startsWith('```'))

    // Join the cleaned lines back into a single string
    return cleanedLines.join('\n')
}
