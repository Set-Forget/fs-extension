console.log('Background Service Worker Loaded')

chrome.runtime.onInstalled.addListener(async () => {
    console.log('Extension installed')
})


chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    const { command } = message
    switch (command) {
        case 'getUserInfo':
            chrome.identity.getProfileUserInfo(userInfo => {
                sendResponse({ userInfo })
            })
            return true
        default:
            break
    }
})

chrome.commands.onCommand.addListener(command => {
    console.log(`Command: ${command}`)

    if (command === 'refresh_extension') {
        chrome.runtime.reload()
    }
})

export {}
