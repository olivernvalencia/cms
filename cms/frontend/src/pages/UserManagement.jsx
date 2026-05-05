import React, { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import { useAuth } from "../components/AuthContext.jsx";
import Search from "../components/Search.jsx";
import Pagination from "../components/Pagination.jsx";
import UserManagementModal from "../components/AddUserModal.jsx";
import cfg from "../../../server/config/domain.js";
import { GrEdit } from "react-icons/gr";
import { FaRegTrashAlt } from "react-icons/fa";
import ToastMessage from "../components/ToastMessage.jsx";
import AlertDialog from "../components/AlertDialog.jsx";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToastMessage, setShowToastMessage] = useState(false);
    const [showDeleteToastMessage, setShowDeleteToastMessage] = useState(false);
    const { barangayId, lguId } = useAuth();
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);
    const [isAlertDeleteOpen, setIsAlertDeleteOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
        console.log(barangayId, lguId);
    }, [barangayId]);

    async function fetchUsers() {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://${cfg.domainname}:${cfg.serverport}/user/${lguId}/${barangayId}`,
                { withCredentials: true }
            );
            setUsers(response.data || []);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Failed to fetch users. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

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
            // Notice the corrected endpoint to match the router configuration
            const response = await axios.delete(
                `http://${cfg.domainname}:${cfg.serverport}/user/delete-user/${selectedDeleteId}`,
                { withCredentials: true }
            );

            console.log("User data received:", response.data); // Add this line
            setUsers(response.data || []);

            if (response.status === 200) {
                setShowDeleteToastMessage(true); // Use toast instead of alert
                fetchUsers(); // Refresh the user list
                setSelectedDeleteId(null);
            }
        } catch (error) {
            console.error("Error deleting user data:", error);
        }
    };

    const filteredUser = Array.isArray(users)
        ? users.filter((u) => {
            const userName = `${u.fullname || ""}`.toLowerCase();
            const userId = `${u.user || ""}`.toLowerCase();
            return userName.includes(searchQuery.toLowerCase()) || userId.includes(searchQuery.toLowerCase());
        })
        : [];

    const totalFilteredPages = Math.ceil((filteredUser?.length) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedUsers = filteredUser?.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleOnSubmit = () => {
        setIsModalOpen(false);
        fetchUsers(); // Fetch updated user data
        setShowToastMessage(true)
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };


    return (
        <div className="flex-grow p-6 bg-gray-100">
            <Breadcrumbs />
            <div>
                <h1 className="text-2xl font-bold text-gray-500 mb-6">User Management</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-6 flex justify-between items-center">
                    <Search searchQuery={searchQuery} onSearchChange={handleSearchChange} />
                    <button
                        className="bg-blue-500 text-white rounded-full px-6 py-2 shadow hover:bg-blue-600 transition duration-200"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Add User
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden text-sm">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-gray-800">Name</th>
                                        <th className="text-left p-4 font-semibold text-gray-800">Username</th>
                                        <th className="text-left p-4 font-semibold text-gray-800">Password</th>
                                        <th className="text-left p-4 font-semibold text-gray-800">Role</th>
                                        <th className="text-center p-4 font-semibold text-gray-800">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedUsers.map((user, index) => (
                                        <tr key={user.id || index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-700 border-b">{user.fullname}</td>
                                            <td className="px-4 py-3 text-gray-700 border-b">{user.username}</td>
                                            <td className="px-4 py-3 text-gray-700 border-b">
                                                {user.password ? "••••••••" : ""}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 border-b">{user.rolename}</td>
                                            <td className="p-3 text-gray-500 flex items-center border-b justify-center gap-2">
                                                <div className="bg-gray-200 p-2 w-max rounded-lg cursor-pointer">
                                                    <GrEdit className="w-5 h-5 text-gray-500" />
                                                </div>
                                                <div
                                                    className="bg-gray-200 p-2 w-max rounded-lg cursor-pointer"
                                                    onClick={() => handleDeleteConfirmation(user.userid)}
                                                >
                                                    <FaRegTrashAlt className="w-5 h-5 text-red-500" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {displayedUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
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
                    </div>
                )}
            </div>

            <UserManagementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleOnSubmit} // Correctly pass function reference
                barangayId={barangayId}
                lguTypeId={lguId}
            />

            <ToastMessage
                message={`User Added Successfully`}
                variant="default"
                isVisible={showToastMessage}
                duration={3000}
                onClose={() => setShowToastMessage(false)}
            />

            <ToastMessage
                message={`User Deleted Successfully`}
                variant="delete"
                isVisible={showDeleteToastMessage}
                duration={3000}
                onClose={() => setShowDeleteToastMessage(false)}
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
        </div>
    );
};

export default UserManagement;