import React from "react";

type InfoModalProps = {
    dm: boolean;
    show: boolean;
};

const InfoModal: React.FC<InfoModalProps> = ({ dm, show }) => {

    const modalClasses = `transition-all origin-right duration-100 ease-in transform ${show ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`;

    return (
        <div className={`p-4 text-xs rounded-lg absolute top-0 -left-[20rem] shadow-lg ${dm ? 'bg-[#2d2d2d]' : 'bg-white'} ${modalClasses}`}>
            <ul className="flex flex-col space-y-4">
                <li className="flex space-x-2">
                    <b>Shift + Enter:</b>
                    <p className="font-extralight">Send current line as prompt to copilot</p>
                </li>
                <li className="flex space-x-2">
                    <b>Tab:</b>
                    <p className="font-extralight">Indent current line</p>
                </li>
                <li className="flex space-x-2">
                    <b>Shift + Tab:</b>
                    <p className="font-extralight">Reverse indent current line</p>
                </li>
            </ul>
        </div>
    )
}

export default InfoModal;
