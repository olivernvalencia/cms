import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { BsHouseAdd } from 'react-icons/bs';
import { FaWpforms } from 'react-icons/fa';
import { MdOutlineReport } from 'react-icons/md';
import { LuUsers } from 'react-icons/lu';
import { HiDocumentReport } from 'react-icons/hi';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { GoDatabase, GoReport } from "react-icons/go";
import { MdOutlineNotificationImportant } from "react-icons/md";
import { RiGovernmentLine } from "react-icons/ri";



const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className={`relative flex flex-col h-full ${isOpen ? 'w-72 min-w-[300px]' : 'min-w-[70px] w-[70px]'} bg-white text-gray-600 transition-width duration-300 shadow-md`}>
            <button
                onClick={toggleSidebar}
                className="absolute top-[-15px] -right-3 bg-white border border-gray-300 rounded-xl p-1 shadow-md focus:outline-none"
            >
                {isOpen ? (
                    <FiChevronLeft className="h-5 w-5 text-gray-600" />
                ) : (
                    <FiChevronRight className="h-5 w-5 text-gray-600" />
                )}
            </button>

            <div className="flex-grow">
                <ul className="flex flex-col p-4">
                    <li className="my-2">
                        <NavLink
                            to="/home"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded transition-colors duration-200 ${isActive ? 'bg-blue-100 text-blue-500' : 'hover:bg-blue-100 hover:text-blue-500'}`
                            }
                        >
                            <RxDashboard className={`h-6 w-6 ${!isOpen ? 'h-8 w-8' : ''} transition-transform`} />
                            {isOpen && <span className="ml-3">Dashboard</span>}
                        </NavLink>
                    </li>
                    <li className="my-2">
                        <NavLink
                            to="/Resident-Management"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded transition-colors duration-200 ${isActive ? 'bg-blue-100 text-blue-500' : 'hover:bg-blue-100 hover:text-blue-500'}`
                            }
                        >
                            <BsHouseAdd className={`h-6 w-6 ${!isOpen ? 'h-8 w-8' : ''} transition-transform`} />
                            {isOpen && <span className="ml-3">Resident Management</span>}
                        </NavLink>
                    </li>
                    <li className="my-2">
                        <NavLink
                            to="/Application-Request"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded transition-colors duration-200 ${isActive ? 'bg-blue-100 text-blue-500' : 'hover:bg-blue-100 hover:text-blue-500'}`
                            }
                        >
                            <FaWpforms className={`h-6 w-6 ${!isOpen ? 'h-8 w-8' : ''} transition-transform`} />
                            {isOpen && <span className="ml-3">Application Request</span>}
                        </NavLink>
                    </li>
                    <li className="my-2">
                        <NavLink
                            to="/Blotter-Report"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded transition-colors duration-200 ${isActive ? 'bg-blue-100 text-blue-500' : 'hover:bg-blue-100 hover:text-blue-500'}`
                            }
                        >
                            <MdOutlineReport className={`h-6 w-6 ${!isOpen ? 'h-8 w-8' : ''} transition-transform`} />
                            {isOpen && <span className="ml-3">Blotter Report</span>}
                        </NavLink>
                    </li>
                    <li className="my-2">
                        <NavLink
                            to="/User-Management"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded transition-colors duration-200 ${isActive ? 'bg-blue-100 text-blue-500' : 'hover:bg-blue-100 hover:text-blue-500'}`
                            }
                        >
                            <LuUsers className={`h-6 w-6 ${!isOpen ? 'h-8 w-8' : ''} transition-transform`} />
                            {isOpen && <span className="ml-3">User Management</span>}
                        </NavLink>
                    </li>
                    <li className="my-2">
                        <NavLink
                            to="/barangay-official"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded transition-colors duration-200 ${isActive ? 'bg-blue-100 text-blue-500' : 'hover:bg-blue-100 hover:text-blue-500'}`
                            }
                        >
                            <RiGovernmentLine className={`h-6 w-6 ${!isOpen ? 'h-8 w-8' : ''} transition-transform`} />
                            {isOpen && <span className="ml-3">Barangay Official</span>}
                        </NavLink>
                    </li>
                    <li className="my-2">
                        <NavLink
                            to="/master-data"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded transition-colors duration-200 ${isActive ? 'bg-blue-100 text-blue-500' : 'hover:bg-blue-100 hover:text-blue-500'}`
                            }
                        >
                            <GoDatabase className={`h-6 w-6 ${!isOpen ? 'h-8 w-8' : ''} transition-transform`} />
                            {isOpen && <span className="ml-3">Master Data</span>}
                        </NavLink>
                    </li>
                    <li className="my-2">
                        <NavLink
                            to="/Reports"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded transition-colors duration-200 ${isActive ? 'bg-blue-100 text-blue-500' : 'hover:bg-blue-100 hover:text-blue-500'}`
                            }
                        >
                            <GoReport className={`h-6 w-6 ${!isOpen ? 'h-8 w-8' : ''} transition-transform`} />
                            {isOpen && <span className="ml-3">Report</span>}
                        </NavLink>
                    </li>
                    <hr />
                    <li className="my-3">
                        <NavLink
                            to="/notification-advisory"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded transition-colors duration-200 ${isActive ? 'bg-blue-100 text-blue-500' : 'hover:bg-blue-100 hover:text-blue-500'}`
                            }
                        >
                            <MdOutlineNotificationImportant className={`h-6 w-6 ${!isOpen ? 'h-8 w-8' : ''} transition-transform`} />
                            {isOpen && <span className="ml-3">Notification Advisory</span>}
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className="p-4 border-t border-gray-300">
                <p>Footer Content</p>
            </div>
        </div>
    );
};

export default Sidebar;
