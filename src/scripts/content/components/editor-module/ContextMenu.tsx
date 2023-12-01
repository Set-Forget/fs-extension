import React from 'react'

const ContextMenu = ({
    rightClickItem,
    positionX,
    positionY,
    isToggled,
    buttons,
    contextMenuRef
}) => {
    return (
        <menu
            ref={contextMenuRef}
            className={`context-menu absolute z-50 bg-white rounded-md text-xs p-1 w-[220px] ${
                isToggled ? 'flex flex-col opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ top: `${positionY}px`, left: `${positionX}px` }}
        >
            {buttons.map((button, index) => {
                if (button.isSpacer)
                    return (
                        <hr key={index} className="border-0 border-b border-gray-300 my-1.5"></hr>
                    )
                return (
                    <div className='w-full rounded-md flex justify-between items-center gap-7 px-1.5 py-2 cursor-pointer hover:bg-green-500 hover:text-white'>
                        <button
                            onClick={e => button.onClick(e, rightClickItem)}
                            key={index}
                            className="context-menu-btn  text-black"
                        >
                            {button.text}
                        </button>
                        {button.icon}
                    </div>
                )
            })}
        </menu>
    )
}

export default ContextMenu
