import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import ActionModal from '../components/ActionModal';
import SuccessMessage from '../components/SuccessMessage';
import ViewResidentModal from '../components/ViewResidentModal';
import cfg from '../../../server/config/config.js';

import { RxAvatar } from "react-icons/rx";
import { GrEdit } from "react-icons/gr";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { IoFingerPrint } from 'react-icons/io5';
import { IoPersonAddOutline } from "react-icons/io5";
import { useAuth } from '../components/AuthContext';

const ResidentManagement = () => {
    const [residents, setResidents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState('');
    const [residentToDelete, setResidentToDelete] = useState(null);
    const [totalResidents, setTotalResidents] = useState(0);
    const [currentResident, setCurrentResident] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [success, setSuccess] = useState(false);
    const [updateSuccess, setupdatedSuccess] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [successMessageText, setSuccessMessageText] = useState('');
    const navigate = useNavigate();
    const { barangayId } = useAuth();
    const location = useLocation();
    const { setSuccessMessage } = location.state || {};


    useEffect(() => {
        fetchResidents();
        fetchTotalResidentCount();

        const editSuccessMessage = sessionStorage.getItem('residentEditSuccess');
        const addedSuccessMessage = sessionStorage.getItem('residentAddedSuccess');

        if (editSuccessMessage === 'true') {
            setSuccess(true);
            setSuccessMessageText('Resident successfully updated.');
            setTimeout(() => setSuccess(false), 3000);
            sessionStorage.removeItem('residentEditSuccess');
        } else if (addedSuccessMessage === 'true') {
            setSuccess(true);
            setSuccessMessageText('Resident successfully added.');
            setTimeout(() => setSuccess(false), 3000);
            sessionStorage.removeItem('residentAddedSuccess');
        }
    }, []);

    const fetchResidents = async () => {
        try {
            const response = await axios.get(`http://${cfg.domainname}:8080/residents/` + barangayId, { withCredentials: true });
            setResidents(response.data);
        } catch (error) {
            console.error("Error fetching residents data:", error);
        }
    };
    console.log(residents);

    const handleAddResidentClick = () => {
        navigate('/resident-management/add-resident');
    }

    const handleViewClick = (resident) => {
        setCurrentResident(resident);
        setIsViewModalOpen(true);
    };

    const handleEditClick = (resident) => {
        setCurrentResident(resident);
        navigate('/resident-management/edit-resident', { state: { residentData: resident } });
        console.log(resident);
    }

    const fetchTotalResidentCount = async () => {
        try {
            const response = await axios.get(`http://${cfg.domainname}:8080/residents/count/` + barangayId, { withCredentials: true });
            setTotalResidents(response.data.count);
        } catch (error) {
            console.error("Error fetching residents count:", error);
        }
    };


    const deleteResident = async (residentId) => {
        try {
            await axios.delete(`http://${cfg.domainname}:8080/residents/` + residentId, { withCredentials: true });
            fetchResidents();
            setDeleteSuccess(true);
            setTimeout(() => setDeleteSuccess(false), 3000);
        } catch (error) {
            console.error("Error deleting resident:", error);
        }
    };

    const handleDeleteClick = (residentId) => {
        console.log(residentId)
        setResidentToDelete(residentId);
        setActionType('delete');
        setIsModalOpen(true);
    };

    const handleModalConfirm = async () => {
        if (actionType === 'delete' && residentToDelete) {
            console.log(residentToDelete);
            await deleteResident(residentToDelete);
            setIsModalOpen(false);
            setResidentToDelete(null);
            setSearchQuery('');
        } else {
            setIsModalOpen(false);
        }
    };

    const totalPages = Math.ceil(residents.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredResidents = residents.filter(resident => {
        const fullName = `${resident.first_name || ''} ${resident.last_name || ''} ${resident.Household_ID || ''}`.toLowerCase();
        const householdIdString = resident.Household_ID != null
            ? resident.Household_ID.toString()
            : '';

        return fullName.includes(searchQuery.toLowerCase()) ||
            householdIdString.includes(searchQuery.toLowerCase());
    });

    const totalFilteredPages = Math.ceil(filteredResidents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedResidents = filteredResidents.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row flex-grow">
                <Sidebar />
                <main className="flex-grow p-4 bg-gray-100">
                    <div className="flex-grow p-6 bg-gray-100">
                        <Breadcrumbs />
                        <h1 className='text-2xl font-bold text-gray-500 mb-6'>Resident Management</h1>
                        <div className='flex items-center justify-between mb-6'>
                            <div className='relative max-w-96 w-full'>
                                <Search
                                    searchQuery={searchQuery}
                                    onSearchChange={handleSearchChange}
                                />
                            </div>
                            <div>
                                <button className='bg-blue-600 text-white px-5 py-3 text-sm flex items-center gap-2 rounded-full' onClick={handleAddResidentClick}>
                                    <IoPersonAddOutline className='w-4 h-4 text-white font-bold' />
                                    Add Resident
                                </button>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                            Total Residents: {totalResidents}
                        </div>
                        <div className="overflow-x-auto mt-4">
                            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm">
                                <thead className='bg-gray-200'>
                                    <tr>
                                        <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                                        <th className="text-left p-3 font-semibold text-gray-700">Address</th>
                                        <th className="text-left p-3 font-semibold text-gray-700">Household ID</th>
                                        <th className="text-left p-3 font-semibold text-gray-700">Registered Voter</th>
                                        <th className="text-left p-3 font-semibold text-gray-700">Contact Number</th>
                                        <th className="text-center p-3 font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResidents.length > 0 ? displayedResidents.map((resident) => (
                                        <tr key={resident.resident_id} className="border-b hover:bg-gray-100 even:bg-gray-50">
                                            <td className="p-3 flex items-center gap-2">
                                                <div className="bg-gray-200 rounded-full">
                                                    {resident.profile_image ? (
                                                        <div
                                                            className="w-10 h-10 rounded-full"
                                                            style={{
                                                                backgroundImage: `url(${resident.profile_image})`,
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
                                                </div>
                                                <div className='flex flex-col leading-4 text-gray-500'>
                                                    <span className='text-sm text-gray-500'>{`${resident.first_name} ${resident.last_name} ${resident.suffix ?? ''}`}</span>
                                                    <span className='text-xs text-gray-400'>{resident.occupation}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-gray-500">
                                                <div className='flex flex-col leading-4 text-gray-500'>
                                                    <span className='text-sm text-gray-500'>{resident.address} {resident.purok}</span>
                                                    <span className='text-xs text-gray-400'>{resident.barangay}, {resident.city}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-gray-500">{resident.household_id}</td>
                                            <td className="p-3 text-gray-500">
                                                {resident.is_registered_voter ? (
                                                    <IoFingerPrint className='text-green-500 h-6 w-6' />
                                                ) : (
                                                    <IoFingerPrint className='text-red-500 h-6 w-6' />
                                                )}
                                            </td>
                                            <td className="p-3 text-gray-500">{resident.contact_number}</td>
                                            <td className="p-3 text-gray-500 flex items-center justify-center gap-2">
                                                <div
                                                    className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer'
                                                    onClick={() => handleEditClick(resident)}
                                                >
                                                    <GrEdit className='w-5 h-5 text-gray-500' />
                                                </div>
                                                <div className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer'
                                                    onClick={() => handleViewClick(resident)}
                                                >
                                                    <FaRegEye className='w-5 h-5 text-gray-500' /></div>
                                                <div
                                                    className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer'
                                                    onClick={() => handleDeleteClick(resident.resident_id)}
                                                >
                                                    <FaRegTrashAlt className='w-5 h-5 text-red-500' />
                                                </div>
                                            </td>
                                        </tr>
                                    )) :
                                        (
                                            <tr>
                                                <td colSpan="6" className="p-4 text-center text-sm text-gray-500">
                                                    No Data Available.
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalFilteredPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                        <ActionModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onConfirm={handleModalConfirm}
                            actionType={actionType}
                        />
                        <ViewResidentModal
                            isOpen={isViewModalOpen}
                            onClose={() => setIsViewModalOpen(false)}
                            residentData={currentResident}
                        />
                        <SuccessMessage
                            message={successMessageText}
                            isVisible={success}
                        />
                        <SuccessMessage
                            message="Resident deleted successfully!"
                            isVisible={deleteSuccess}
                            variant="delete"
                        />
                        <SuccessMessage
                            message={successMessageText}
                            isVisible={updateSuccess}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ResidentManagement;
