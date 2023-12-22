import React, { useState, useEffect } from 'react'
import CustomPopup from './CustomPopup'
import { EXCEL_URL, GOOGLE_URL } from '@/utils/constants'

const FloatingBtn: React.FC = () => {
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const [url, setUrl] = useState<string | null>(null)

    const buttonText: string = showPopup ? 'Close Formula Studio' : 'Open Formula Studio'

    useEffect(() => {
        // Immediately invoked function to fetch and set the URL
        (function fetchUrl() {
            const currentUrl = sessionStorage.getItem('currentUrl')
            setUrl(currentUrl)
        })()
    }, [])

    const buttonClasses = `relative w-16 h-16 flex items-center justify-center bg-gradient-to-tr ${
        url === GOOGLE_URL
            ? 'from-green-400 to-emeraldGreen-700'
            : 'from-gray-900 to-gothamBlack-300'
    } text-3xl text-white font-bold rounded-full z-10 ${
        isHovered ? 'w-52' : ''
    } transition-all duration-500 transform grow-on-load scale-0
    ${url === EXCEL_URL ? 'from-green-500 to-blue-600' : ''}`

    return (
        <div className="!z-[1000] fixed 2xl:bottom-8 2xl:right-8 bottom-4 right-4 flex items-center">
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex items-center"
            >
                <div onClick={() => setShowPopup(!showPopup)} className={buttonClasses}>
                    <p
                        style={{
                            transition: isHovered ? 'opacity 500ms 300ms' : 'opacity 200ms'
                        }}
                        className={`absolute bottom-[20px] left-4 text-sm ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                        } ${url === GOOGLE_URL ? '' : 'text-sm'}
                        ${url === EXCEL_URL ? 'font-bold font-sans' : ''}
                        `}
                    >
                        {buttonText}
                    </p>
                    <p
                        className={`absolute ${
                            isHovered ? 'rotate-[360deg]' : 'rotate-0'
                        } transition-transform ${
                            url === GOOGLE_URL
                                ? 'bottom-[14px] right-[18px] font-semibold'
                                : 'font-semibold bottom-[16px] right-[16px]'
                        }
                            ${
                                url === EXCEL_URL
                                    ? 'font-extrabold font-sans bottom-[17px] right-[15px]'
                                    : ''
                            }
                            `}
                    >
                        {'{ }'}
                    </p>
                </div>
            </div>

            <CustomPopup showPopup={showPopup} />
        </div>
    )
}

export default FloatingBtn
