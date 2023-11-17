import React from "react";

type InfoModalProps = {
    dm: boolean;
    show: boolean;
};

const InfoModal: React.FC<InfoModalProps> = ({ dm, show }) => {

    const modalClasses = `transition-all origin-right duration-100 ease-in transform ${show ? 'opacity-95 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`;

    return (
        <div className={`p-4 text-xs rounded-lg absolute top-0 -left-[20rem] shadow-lg ${dm ? 'bg-[#32332D]' : 'bg-white'} ${modalClasses}`}>
            <ul className="flex flex-col space-y-4">
                <li className="flex space-x-2 justify-between">
                    <b>Shift + Enter</b>
                    <p className="font-extralight">Send current line as prompt to copilot</p>
                </li>
                <li className="flex space-x-2 justify-between">
                    <b>Tab</b>
                    <p className="font-extralight">Indent current line</p>
                </li>
                <li className="flex space-x-2 justify-between">
                    <b>Shift + Tab</b>
                    <p className="font-extralight">Reverse indent current line</p>
                </li>
                <li className="flex space-x-2 justify-between">
                    <b>Ctrl + 0</b>
                    <p className="font-extralight text-simplyRed-500">Clear the editor</p>
                </li>
            </ul>
        </div>
    )
}

export default InfoModal;
