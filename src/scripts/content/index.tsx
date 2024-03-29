import React from 'react'
import { createRoot } from 'react-dom/client'
import styles from '@/styles/index.css?inline'
import App from './App'
import codemirrorStyles from '../../lib/codemirror-5.65.15/lib/codemirror.css?inline';

const isProduction: boolean = process.env.NODE_ENV === 'production'
const ROOT_ID = 'EDITOR'

const injectReact = (rootId: string): void => {
    try {
        const container = document.createElement('div')
        document.body.appendChild(container)

        if (container) {
            container.id = rootId
            container.style.position = 'inherit'
            container.style.zIndex = '2147483666'
        }

        if (isProduction) {
            console.log('Production mode 🚀. Adding Shadow DOM')
            container.attachShadow({ mode: 'open' })
        } else {
            console.log('Development mode 🛠')
        }

        const target: ShadowRoot | HTMLElement = isProduction ? container.shadowRoot! : container

        const root = createRoot(target!)

        root.render(
            <React.StrictMode>
                <>
                    {isProduction && <style>{String(styles) + String(codemirrorStyles)}</style>}
                    <App />
                </>
            </React.StrictMode>
        )
    } catch (error) {
        console.error('Error Injecting React', error)
    }
}

injectReact(ROOT_ID)
