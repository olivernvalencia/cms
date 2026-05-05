import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '../components/AuthContext';
import cfg from '../../../server/config/domain';
import SearchModal from '../components/SearchModal'
import ToastMessage from '../components/ToastMessage';
import AlertDialog from '../components/AlertDialog';
import Search from '../components/Search';
import Pagination from '../components/Pagination';

import { IoSearch } from 'react-icons/io5';
import { FaRegTrashAlt } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";

const BarangayCouncil = () => {
    const { barangayId } = useAuth();
    const [barangayOfficials, setBarangayOfficials] = useState([]);
    const [barangayOfficialType, setBarangayOfficialType] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);
    const [isAlertDeleteOpen, setIsAlertDeleteOpen] = useState(false);
    const [showEditOfficialToastMessage, setShowEditOfficialToastMessage] = useState(false);
    const [showAddOfficialToastMessage, setShowAddOfficialToastMessage] = useState(false);
    const [showDeleteToastMessage, setShowDeleteToastMessage] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOfficial, setSelectedOfficial] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (barangayId) {
            fetchBarangayOfficials();
        }
        fetchBarangayOfficialType();
    }, [barangayId]);

    const fetchBarangayOfficials = async () => {
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/official/1/${barangayId}`, {
                withCredentials: true,
            });
            if (response.status !== 200) throw new Error("Something went wrong with fetching data");
            setBarangayOfficials(response.data.data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchBarangayOfficialType = async () => {
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/official/official-type/${1}`, {
                withCredentials: true,
            });
            if (response.status !== 200) throw new Error("Something went wrong with fetching data");
            setBarangayOfficialType(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleOfficialAdded = () => {
        setShowAddOfficialToastMessage(true);
        setIsModalOpen(false);
        fetchBarangayOfficials();
    };

    const handleDeleteConfirmation = async (id) => {
        setSelectedDeleteId(id);
        setIsAlertDeleteOpen(true);
    }

    const handleDeleteUser = async () => {
        if (!selectedDeleteId) {
            console.error("Cannot delete user: User ID is undefined");
            alert("Error: Cannot delete user due to missing ID");
            return;
        }

        try {
            const response = await axios.delete(
                `http://${cfg.domainname}:${cfg.serverport}/official/delete-official/${selectedDeleteId}`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                setShowDeleteToastMessage(true);
                fetchBarangayOfficials();
                setSelectedDeleteId(null);
                setIsAlertDeleteOpen(false);
            }
        } catch (error) {
            console.error("Error deleting official:", error);
            alert(error.response?.data?.error || "Failed to delete official. Please try again.");
        }
    };

    const handleEditClick = (official) => {
        setSelectedOfficial(official);
        setIsEditModalOpen(true);
    };

    const handleOfficialEdited = () => {
        setShowEditOfficialToastMessage(true);
        setIsEditModalOpen(false);
        fetchBarangayOfficials();
    };

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

    const filteredOfficial = barangayOfficials.filter(official => {
        const officialName = `${official.full_name || ''}`.toLowerCase();
        const officialId = official.official_id != null
            ? official.official_id.toString()
            : '';

        return officialName.includes(searchQuery.toLowerCase()) ||
            officialId.includes(searchQuery.toLowerCase());
    });

    const totalFilteredPages = Math.ceil(filteredOfficial.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedOfficial = filteredOfficial.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className='flex justify-between'>
                <div className='relative max-w-96 w-full'>
                    <Search
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        placeholder='Search Official'
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md mb-6 shadow hover:bg-blue-600 transition duration-200"
                >
                    + Add Member
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="text-left p-4 font-semibold text-gray-800">Name</th>
                            <th className="text-left p-4 font-semibold text-gray-800">Designated Role</th>
                            <th className="text-center p-4 font-semibold text-gray-800">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOfficial.length > 0 ? (displayedOfficial.map((official) => (
                            <tr key={official.official_id} className="hover:bg-blue-50">
                                <td className="px-4 py-3 text-gray-500 border-b">
                                    <div className="flex flex-col leading-4 text-gray-500">
                                        <span className="text-sm text-gray-500">{`${official.full_name}`}</span>
                                        <span className="text-xs text-gray-400">{official.official_position}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-500 border-b">{official.committee}</td>
                                <td className="px-4 py-3 text-center flex justify-center gap-2 border-b">
                                    <div
                                        className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer'
                                        onClick={() => handleEditClick(official)}
                                    >
                                        <GrEdit className='w-5 h-5 text-gray-500' />
                                    </div>
                                    <div
                                        className="bg-gray-200 p-2 w-max rounded-lg cursor-pointer"
                                        onClick={() => handleDeleteConfirmation(official.official_id)}
                                    >
                                        <FaRegTrashAlt className="w-5 h-5 text-red-500" />
                                    </div>
                                </td>
                            </tr>
                        ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-sm text-gray-500">
                                    No Data Available.
                                </td>
                            </tr>)

                        }
                    </tbody>
                </table>
            </div>

            {filteredOfficial.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalFilteredPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}

            <ToastMessage
                message="Official Added Successfully"
                variant="default"
                isVisible={showAddOfficialToastMessage}
                duration={3000}
                onClose={() => setShowAddOfficialToastMessage(false)}
            />

            <ToastMessage
                message={`Official Deleted Successfully`}
                variant="delete"
                isVisible={showDeleteToastMessage}
                duration={3000}
                onClose={() => setShowDeleteToastMessage(false)}
            />

            <ToastMessage
                message="Official Updated Successfully"
                variant="default"
                isVisible={showEditOfficialToastMessage}
                duration={3000}
                onClose={() => setShowEditOfficialToastMessage(false)}
            />

            <AlertDialog
                isOpen={isAlertDeleteOpen}
                message={"Are you sure you want to delete this record? This action cannot be undone, and the record will be permanently removed."}
                title="Delete Confirmation"
                buttonConfig={[
                    {
                        label: "Cancel",
                        color: "bg-gray-200 text-gray-600",
                        action: () => {
                            setIsAlertDeleteOpen(false);
                            setSelectedDeleteId(null);
                        },
                    },
                    {
                        label: "Yes, Delete",
                        color: "bg-red-600 text-white",
                        action: async () => {
                            await handleDeleteUser();
                            setIsAlertDeleteOpen(false);
                        },
                    },
                ]}
            />

            {isModalOpen && (
                <AddOfficialModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleOfficialAdded}
                    barangayId={barangayId}
                    officialTypes={barangayOfficialType}
                />
            )}

            {isEditModalOpen && selectedOfficial && (
                <EditOfficialModal
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={handleOfficialEdited}
                    official={selectedOfficial}
                    barangayId={barangayId}
                    officialTypes={barangayOfficialType}
                />
            )}
        </div>
    );
};

const AddOfficialModal = ({ onClose, onSuccess, barangayId, officialTypes }) => {
    const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);
    const [residentName, setIsResidentName] = useState(null);
    const [formData, setFormData] = useState({
        official_type_id: "",
        resident_id: "",
        full_name: "",
        position_rank: "",
        committee: "",
        barangay_id: barangayId,
        city_id: "",
        province_id: ""
    });

    const handleSelectResident = (resident) => {
        setFormData(prev => ({
            ...prev,
            resident_id: resident.resident_id,
            full_name: `${resident.first_name} ${resident.last_name}`,
            city_id: resident.city_id,
            province_id: resident.province_id,
        }));
        setIsResidentName(`${resident.first_name} ${resident.last_name}`)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://${cfg.domainname}:${cfg.serverport}/official/add-official`,
                formData,
                { withCredentials: true }
            );

            if (response.data.success) {
                onSuccess();
            } else {
                throw new Error(response.data.error || "Failed to add official");
            }
        } catch (error) {
            console.error("Error adding official:", error);
            alert(error.message || "Failed to add official. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">Add New Official</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-500">Official Type</label>
                        <select
                            name="official_type_id"
                            value={formData.official_type_id}
                            onChange={handleInputChange}
                            className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Official Type</option>
                            {officialTypes.map((type) => (
                                <option className='text-gray-700' key={type.iid} value={type.iid}>
                                    {type.iname}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-500">Resident</label>
                        <div className="relative rounded-md ">
                            <input type="text" name="Reside" placeholder="Type or Search Complainant Name" className=" text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md  focus:ring-2 focus:ring-blue-500" value={residentName} onChange={(e) => setIsResidentName(e.target.value)} />
                            <div className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md" onClick={() => setIsResidentModalOpen((prev) => !prev)}>
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Resident"
                                isOpen={isResidentModalOpen}
                                onClose={() => setIsResidentModalOpen(false)}
                                onSelect={handleSelectResident}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-500">Position Rank</label>
                        <input
                            type="text"
                            name="position_rank"
                            value={formData.position_rank}
                            onChange={handleInputChange}
                            className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-500">Committee</label>
                        <input
                            type="text"
                            name="committee"
                            value={formData.committee}
                            onChange={handleInputChange}
                            className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        >
                            Add Official
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditOfficialModal = ({ onClose, onSuccess, official, barangayId, officialTypes }) => {
    const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);
    const [residentName, setIsResidentName] = useState(official.full_name || '');
    const [formData, setFormData] = useState({
        official_type_id: official.official_type_id || "",
        resident_id: official.resident_id || "",
        full_name: official.full_name || "",
        position_rank: official.position_rank || "",
        committee: official.committee || "",
        barangay_id: barangayId,
        city_id: official.city_id || "",
        province_id: official.province_id || ""
    });

    const handleSelectResident = (resident) => {
        setFormData(prev => ({
            ...prev,
            resident_id: resident.resident_id,
            full_name: `${resident.first_name} ${resident.last_name}`,
            city_id: resident.city_id,
            province_id: resident.province_id,
        }));
        setIsResidentName(`${resident.first_name} ${resident.last_name}`);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://${cfg.domainname}:${cfg.serverport}/official/update-official/${official.official_id}`,
                formData,
                { withCredentials: true }
            );

            if (response.status === 200) {
                onSuccess();
            } else {
                throw new Error(response.data.error || "Failed to update official");
            }
        } catch (error) {
            console.error("Error updating official:", error);
            alert(error.message || "Failed to update official. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">Edit Official</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-500">Official Type</label>
                        <select
                            name="official_type_id"
                            value={formData.official_type_id}
                            onChange={handleInputChange}
                            className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Official Type</option>
                            {officialTypes.map((type) => (
                                <option className='text-gray-700' key={type.iid} value={type.iid}>
                                    {type.iname}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-500">Resident</label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="Resident"
                                placeholder="Type or Search Resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={residentName}
                                onChange={(e) => setIsResidentName(e.target.value)}
                                readOnly
                            />
                            <div className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md" onClick={() => setIsResidentModalOpen((prev) => !prev)}>
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Resident"
                                isOpen={isResidentModalOpen}
                                onClose={() => setIsResidentModalOpen(false)}
                                onSelect={handleSelectResident}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-500">Position Rank</label>
                        <input
                            type="text"
                            name="position_rank"
                            value={formData.position_rank}
                            onChange={handleInputChange}
                            className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-500">Committee</label>
                        <input
                            type="text"
                            name="committee"
                            value={formData.committee}
                            onChange={handleInputChange}
                            className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BarangayCouncil;