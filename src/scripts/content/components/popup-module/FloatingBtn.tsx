import React, {useState} from 'react';
import CustomPopup from './CustomPopup';

const FloatingBtn: React.FC = () => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const buttonText: string = showPopup ? 'Close Formula Studio' : 'Open Formula Studio';

    return (
        <div className="fixed bottom-16 right-16 flex items-center">
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex items-center"
            >
                <div
                    onClick={() => setShowPopup(!showPopup)}
                    className={`relative w-16 h-16 flex items-center justify-center bg-gradient-to-tr from-green-400 to-emeraldGreen-700 text-3xl text-white font-bold rounded-full z-10 ${
                        isHovered ? 'w-52' : ''
                    } transition-all duration-500`}
                >
                    <p
                        style={{
                            transition: isHovered ? 'opacity 500ms 300ms' : 'opacity 200ms'
                        }}
                        className={`absolute bottom-[20px] left-4 text-sm ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {buttonText}
                    </p>
                    <p
                        className={`absolute bottom-[14px] right-[18px] ${
                            isHovered ? 'rotate-[360deg]' : 'rotate-0'
                        } transition-transform`}
                    >
                        {'{ }'}
                    </p>
                </div>
            </div>

            <CustomPopup showPopup={showPopup} />
        </div>
    );
}

export default FloatingBtn;