import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import cfg from '../../../server/config/domain.js';
import { useAuth } from './AuthContext';
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";

export default function SearchModal({
    isOpen,
    title = "Title",
    onClose,
    onSelect,
    options,
}) {
    const { barangayId } = useAuth();
    const [residents, setResidents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);

    const itemsPerPage = 4;

    useEffect(() => {
        if (isOpen && barangayId) {
            fetchResidents();
        }
    }, [isOpen, barangayId]);

    const fetchResidents = async () => {
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/residents/` + barangayId, { withCredentials: true });
            setResidents(response.data);
        } catch (error) {
            console.error("Error fetching residents data:", error);
        }
    };

    const filteredResidents = useMemo(() => {
        return residents.filter((resident) => {
            const residentFullName = `${resident?.first_name} ${resident?.last_name}`.toLowerCase();
            const residentAddress = `${resident?.purok}`.toLowerCase();
            return residentFullName.includes(searchTerm.toLowerCase())
                || residentAddress.includes(searchTerm.toLowerCase())
                || resident?.barangay.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [residents, searchTerm]);

    const paginatedResidents = filteredResidents?.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    const handleSelect = (resident) => {
        if (onSelect) onSelect(resident);
        handleOnClose();
    };

    const handleOnClose = () => {
        onClose();
        setSearchTerm("");
        setCurrentPage(0);
    };

    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < filteredResidents.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-md select-none rounded-lg shadow-lg p-6 max-h-[560px] min-h-[560px]">
                <div className='flex justify-between'>
                    <h2 className="text-xl font-semibold mb-4">{title}</h2>
                    <IoClose
                        className='w-6 h-6 cursor-pointer'
                        onClick={() => handleOnClose()}
                    />
                </div>
                <div className="text-gray-700 mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search for Name or Address"
                        className="text-sm border rounded-md border-gray-300 p-2 mb-4 w-full text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <CardList>
                        {
                            paginatedResidents?.length > 0 ? paginatedResidents?.map((resident) => (
                                <Card key={resident.resident_id} resident={resident} onClick={() => handleSelect(resident)} />
                            )) : <div className='my-auto text-center'>No residents found.</div>
                        }
                    </CardList>
                </div>
                <div className="flex justify-end items-center mt-4 gap-2">
                    <IoIosArrowBack
                        className={`w-9 h-9 text-gray-500 p-2 border border-gray-300 rounded-lg cursor-pointer ${currentPage === 0 ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-200'
                            }`}
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                    />
                    <IoIosArrowBack
                        className={`w-9 h-9 text-gray-500 p-2 border border-gray-300 rounded-lg cursor-pointer transform rotate-180 ${(currentPage + 1) * itemsPerPage >= filteredResidents.length ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-200'
                            }`}
                        onClick={handleNextPage}
                        disabled={(currentPage + 1) * itemsPerPage >= filteredResidents.length}
                    />
                </div>
            </div>
        </div>, document.body
    );
}

function CardList({ children }) {
    return (
        <ul className='flex flex-col gap-2 min-h-[350px]'>
            {children}
        </ul>
    );
}

function Card({ resident, onClick }) {
    return (
        <li className="flex items-center gap p-4 border rounded-md hover:bg-blue-50 border-gray-300 hover:border-blue-500 shadow-sm transition-colors cursor-pointer select-none" onClick={onClick}>
            {resident?.profile_image ? (
                <div
                    className="w-12 h-12 rounded-full"
                    style={{
                        backgroundImage: `url(http://${cfg.domainname}:${cfg.serverport}${resident?.profile_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '2.5rem',
                        width: '2.5rem',
                        borderRadius: '50%',
                        overflow: 'hidden',
                    }}
                    role="img"
                    aria-label="Resident"
                />
            ) : (
                <RxAvatar className="w-10 h-10 text-gray-400" />
            )}
            <div className="ml-4">
                <h3 className="font-bold text-gray-800">{`${resident.first_name} ${resident.last_name}`}</h3>
                <p className="text-sm text-gray-600">{`${resident.address}${resident.address.trim() ? "," : ""} ${resident.purok}, ${resident.barangay}`}</p>
            </div>
        </li>
    );
}
