import React, { useState, useEffect, useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

const ComplaintTypes = [
    { title: "Noise Complaints" },
    { title: "Property Disputes" },
    { title: "Public Disorder" },
    { title: "Violation of Barangay Ordinances" },
    { title: "Domestic Issues" },
    { title: "Traffic Violations" },
    { title: "Drug-Related Concerns" },
    { title: "Health and Sanitation Issues" },
    { title: "Environmental Concerns" },
    { title: "Violations of Business Regulations" },
    { title: "Community or Public Safety Issues" },
    { title: "Electrical or Utility Issues" },
    { title: "Disturbance from Animals" },
    { title: "Illegal Construction" },
    { title: "Discrimination or Harassment" },
    { title: "Illegal Gambling" },
    { title: "Public Health Violations" },
    { title: "Illegal Logging or Deforestation" },
    { title: "Electricity or Power Issues" },
    { title: "Noise from Religious or Public Gatherings" },
];

const SearchDropdown = ({
    options = ComplaintTypes,
    placeholder = "Search complaint type...",
    title = "Select complaint type",
    selectedValue = "",
    onSelect,
    uniqueKey,
    onSelectOption,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        setSelectedType(selectedValue);
    }, [selectedValue]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleOptionClick = (option) => {
        if (disabled) return;
        setSelectedType(uniqueKey && option[uniqueKey] ? option[uniqueKey] : option.title);
        setIsOpen(false);
        setSearchTerm("");
        if (onSelect) {
            onSelect(option);
        }
    };

    const handleOptionRemove = (e) => {
        e.stopPropagation();
        if (disabled) return;
        setSelectedType("");
        setIsOpen(false);
        setSearchTerm("");
        if (onSelect) {
            onSelect(null);
        }
    };

    const filteredOptions = options?.filter((option) => {
        const keyToUse = uniqueKey && option[uniqueKey] ? option[uniqueKey] : option.title;
        return keyToUse.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const toggleDropdown = () => {
        if (disabled) return;
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
                className={`relative border text-sm p-2 w-full rounded-md cursor-pointer focus:outline-none 
                ${disabled ? "bg-gray-200 cursor-not-allowed text-gray-400" : "border-gray-300 text-gray-500 focus:ring-2 focus:ring-blue-500"}`}
                onClick={toggleDropdown}
            >
                {selectedType || <span className="text-gray-400">{title}</span>}
                {selectedType && !disabled && (
                    <IoCloseCircleOutline
                        onClick={handleOptionRemove}
                        className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500"
                    />
                )}
            </div>
            {isOpen && !disabled && (
                <div className="absolute bg-white border border-gray-300 px-4 py-6 rounded-md shadow-lg mt-1 w-full z-10">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder={placeholder}
                        className="text-sm border rounded border-gray-300 p-2 mb-4 w-full text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={disabled} // Disable input when disabled
                    />
                    <ul className="max-h-40 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option[uniqueKey] || option.title}
                                    onClick={() => handleOptionClick(option)}
                                    className={`p-2 text-sm hover:bg-blue-100 cursor-pointer 
                                        ${(option[uniqueKey] || option.title) === selectedType ? "bg-blue-100" : ""}`}
                                >
                                    {option[uniqueKey] || option.title}
                                </li>
                            ))
                        ) : (
                            <li className="p-2 text-sm text-gray-500">Result Not Found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;
