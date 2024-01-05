import excelFunctions from './excel.json'
import sheetFunctions from './google.json'
import notionFunctions from './notion.json'
import { EXCEL_URL, GOOGLE_URL, NOTION_URL } from '@/utils/constants'

const spreadsheetsHint = editor => {
    const cursor = editor.getCursor()
    const token = editor.getTokenAt(cursor)
    const start = token.start
    const end = cursor.ch
    const url = sessionStorage.getItem('currentUrl')
    const currentWord = token.string.toUpperCase()
    let list
    switch (url) {
        case GOOGLE_URL:
            list = sheetFunctions
            break
        case EXCEL_URL:
            list = excelFunctions
            break
        case NOTION_URL:
            list = notionFunctions
            break
        default:
            list = []
            break
    }

    list = list.filter(item => item.toUpperCase().startsWith(currentWord))

    return {
        list: list.length ? list : [],
        from: window.CodeMirror.Pos(cursor.line, start),
        to: window.CodeMirror.Pos(cursor.line, end)
    }
}

export default spreadsheetsHint
