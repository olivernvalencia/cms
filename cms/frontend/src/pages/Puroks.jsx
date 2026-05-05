import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '../components/AuthContext';
import ToastMessage from '../components/ToastMessage'
import cfg from '../../../server/config/domain';
import AlertDialog from '../components/AlertDialog';
import Search from '../components/Search';
import Pagination from '../components/Pagination';

import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";

const Puroks = () => {

    const [puroks, setPuroks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [purokName, setPurokName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [showToasTmessage, setShowToastMessage] = useState(false);
    const [isAlertDeletePurok, setIsAlertDeletePurok] = useState(false);
    const [selectedPurokDeleteId, setSelectedPurokDeleteId] = useState(null);
    const [purokShowToastMessage, setPurokShowToastMessage] = useState(false);

    const { barangayId } = useAuth();

    useEffect(() => {
        fetchPurok();
    }, []);

    const fetchPurok = async () => {
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/purok/get-puroks/` + barangayId, { withCredentials: true });
            setPuroks(response.data[0]);
        } catch (error) {
            console.error("Error fetching residents data:", error);
        }
    };

    const handleDeletePurok = async (residentId) => {
        try {
            await axios.delete(`http://${cfg.domainname}:${cfg.serverport}/purok/delete-puroks/` + selectedPurokDeleteId, { withCredentials: true });
            fetchPurok();
            setSelectedPurokDeleteId(null);
            setPurokShowToastMessage(true);
        } catch (error) {
            console.error("Error deleting purok:", error);
        }
    };

    const handleDeletePurokModal = async () => {
        setIsAlertDeletePurok(true);
    }

    const handleAddPurok = async (e) => {
        e.preventDefault();

        // if (!purokName) {
        //     alert("Please enter an address.");
        //     return;
        // }

        try {
            const payload = {
                p_puroks: [purokName],
                p_barangay_id: barangayId,
            };

            await axios.post(`http://${cfg.domainname}:${cfg.serverport}/purok/add-puroks`, payload, { withCredentials: true });
            fetchPurok();
            setShowModal(false);
            setPurokName('');
            setShowToastMessage(true)
        } catch (error) {
            console.error("Error adding purok data:", error);
        }
    };

    const totalPages = Math.ceil(puroks.length / itemsPerPage);

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

    const filteredPuroks = puroks.filter(purok => {
        const purokName = `${purok.purok_name || ''}`.toLowerCase();
        const purokId = purok.purok_id != null
            ? purok.purok_id.toString()
            : '';

        return purokName.includes(searchQuery.toLowerCase()) ||
            purokId.includes(searchQuery.toLowerCase());
    });

    const totalFilteredPages = Math.ceil(filteredPuroks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedPuroks = filteredPuroks.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className='flex justify-between'>
                <div className='relative max-w-96 w-full'>
                    <Search
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        placeholder='Search Purok'
                    />
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md mb-6 shadow hover:bg-blue-600 transition duration-200"
                >
                    + Add Address
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Add Address</h2>
                        <form onSubmit={handleAddPurok}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Street/Subdivision Name
                                </label>
                                <input
                                    type="text"
                                    value={purokName}
                                    onChange={(e) => setPurokName(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter address"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="text-left p-4 font-semibold text-gray-800">Street/Subdivision</th>
                            <th className="text-center p-4 font-semibold text-gray-800">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPuroks.length > 0 ? (
                            displayedPuroks.map((purok) => (
                                <tr key={purok.purok_id} className="hover:bg-blue-50">
                                    <td className="px-4 py-3 text-gray-500 border-b">{purok.purok_name}</td>
                                    <td className="px-4 py-3 text-center flex justify-center border-b">
                                        <div
                                            className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer'
                                            onClick={() => {
                                                setSelectedPurokDeleteId(purok.purok_id);
                                                handleDeletePurokModal();
                                            }}
                                        >
                                            <FaRegTrashAlt className='w-5 h-5 text-red-500' />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-sm text-gray-500">
                                    No Data Available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {filteredPuroks.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalFilteredPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}

            <ToastMessage
                message={`Purok Added Successfully`}
                variant="default"
                isVisible={showToasTmessage}
                duration={3000}
                onClose={() => setShowToastMessage(false)}
            />

            <ToastMessage
                message="Purok record successfully deleted!"
                variant="delete"
                isVisible={purokShowToastMessage}
                duration={3000}
                onClose={() => setPurokShowToastMessage(false)}
            />

            <AlertDialog
                isOpen={isAlertDeletePurok}
                message={"Are you sure you want to delete this record? This action will process the record."}
                title="Delete Purok"
                buttonConfig={[
                    {
                        label: "Cancel",
                        color: "bg-gray-200 text-gray-600",
                        action: () => {
                            setIsAlertDeletePurok(false);
                            setSelectedPurokDeleteId(null);
                        }
                    },
                    {
                        label: "Yes, Submit",
                        color: "bg-red-500 text-white",
                        action: async () => {
                            await handleDeletePurok();
                            setIsAlertDeletePurok(false);
                        },
                    },
                ]}
            />
        </div>
    );
};

export default Puroks;