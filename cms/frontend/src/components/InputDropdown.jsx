import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";

const InputDropdown = ({
    options = [],
    placeholder = "Input",
    title = "",
    onAddValue,
    onRemoveValue
}) => {

    const dropdownRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState("");

    const handleAdd = () => {
        if (!value) return;

        setValue("");
        onAddValue(value)
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="relative border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 select-none text-nowrap overflow-hidden text-ellipsis "
                onClick={toggleDropdown}
            >
                {options?.length > 0
                    ? <span>{options.join(", ")}</span>
                    : <span className='text-gray-400'>{title}</span>}

            </div>
            {isOpen && (
                <div className="absolute bg-white border border-gray-300 px-4 py-6 rounded-md shadow-lg mt-1 w-full z-10">
                    <div className='flex gap-2 mb-4'>
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAdd();
                                }
                            }}
                            className="text-sm border rounded border-gray-300 p-2 w-full text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className={`bg-blue-500 text-white text-sm py-2 px-4 rounded `}
                            onClick={handleAdd}
                        >
                            Add
                        </button>
                    </div>
                    <ul className="max-h-40 overflow-y-auto">
                        {
                            options?.length > 0
                                ? options?.map((item, index) =>
                                    <li
                                        key={index}
                                        className='flex justify-between p-2 text-sm hover:bg-blue-100 cursor-pointer rounded'>
                                        {item}
                                        <IoCloseCircleOutline
                                            className="w-5 h-5 text-red-500"
                                            onClick={() => onRemoveValue(item)} />
                                    </li>)
                                : (
                                    <li className="p-2 text-center text-sm text-gray-400">Empty.</li>
                                )
                        }
                    </ul>
                </div>
            )}
        </div>
    )
}

export default InputDropdown
