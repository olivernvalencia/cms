import axios from "axios";
import cfg from '../../../server/config/domain.js';
import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useDateFormatter } from "../hooks/useDateFormatter";
import { encryptId } from "../utils/encryption.js";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import StatusBadge from "../components/StatusBadge";
import ToastMessage from "../components/ToastMessage.jsx";
import AlertDialog from "../components/AlertDialog.jsx";
import Loader from "../components/Loader";

import { IoPersonAddOutline, IoDocumentText } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { GrEdit } from "react-icons/gr";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Tabs from "../components/Tabs.jsx";


const BlotterIncidentPage = () => {

    const { barangayId } = useAuth();
    const { formatIncidentDate } = useDateFormatter();

    const navigate = useNavigate();

    const [incidentData, setIncidentData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedDeleteId, setSelectedDeleteId] = useState(null);

    //Toast
    const [showDeleteToast, setShowDeleteToast] = useState(false);

    //Alert
    const [isAlertDeleteOpen, setIsAlertDeleteOpen] = useState(false);

    useEffect(() => {
        fetchIncidentDetails();
    }, [barangayId]);

    const fetchIncidentDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/incident/get-all-incidents/${barangayId}`, { withCredentials: true });
            setIncidentData(response.data);
        } catch (error) {
            console.error("Error fetching incident data:", error);
            setError("Failed to retrieve incident data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteIncident = async () => {
        try {
            const response = await axios.delete(`http://${cfg.domainname}:${cfg.serverport}/incident/${selectedDeleteId}`, { withCredentials: true });

            if (response.status === 200 || response.status === 204) {
                setSelectedDeleteId(null)
                fetchIncidentDetails();
                navigate('/blotter-report', { state: { incidentToastType: "Delete" } });
            } else {
                console.warn("Unexpected response status:", response.status);
            }
        } catch (error) {
            console.error("Error deleting incident data:", error);
            setError("Failed to delete incident data");
        }
    }

    const handleDeleteConfirmation = async (id) => {
        setSelectedDeleteId(id);
        setIsAlertDeleteOpen(true);
    }

    const filteredIncidents = incidentData?.filter(incident => {
        const reporterName = `${incident.reporter_name || ''}`.toLowerCase();
        const incidentId = incident.incident_id != null
            ? incident.incident_id.toString()
            : '';
        return reporterName.includes(searchQuery.toLowerCase()) ||
            incidentId.includes(searchQuery.toLowerCase())
    });
    const totalIncidentPages = Math.ceil((filteredIncidents?.length) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedIncident = filteredIncidents?.slice(startIndex, startIndex + itemsPerPage);


    const handlePageChange = (page) => setCurrentPage(page);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleEditIncident = (id) => {
        navigate("/blotter-report/edit-incident", { state: { incident_id: id } })
    }

    const handleViewIncident = (id) => {
        navigate("/blotter-report/incident-report-view", { state: { incident_id: id } })
    }

    if (loading) return <Loader type="block" />;

    return (
        <>
            <div className='flex items-center justify-between mb-6'>
                <div className='relative max-w-96 w-full'>
                    <Search
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        placeholder="Search Reporter Name, Incident ID"
                    />
                </div>
                <div className="flex gap-5">
                    <button className='bg-blue-600 text-white px-5 py-3 text-sm flex items-center gap-2 rounded-full' onClick={() => navigate("/blotter-report/add-incident")} >
                        <IoDocumentText className='w-4 h-4 text-white font-bold' />
                        Add Incident
                    </button>
                </div>
            </div>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {
                !loading && <div className="overflow-x-auto rounded-lg mt-4">
                    <table className="min-w-full bg-white shadow-md overflow-hidden text-sm">
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className="text-left p-3 font-semibold text-gray-700">Reporter Name</th>
                                <th className="text-left p-3 font-semibold text-gray-700">Incident Report ID</th>
                                <th className="text-left p-3 font-semibold text-gray-700">Nature of Incident</th>
                                <th className="text-left p-3 font-semibold text-gray-700">Incident Date</th>
                                <th className="text-center p-3 font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredIncidents.length > 0 ? displayedIncident.map((incident) => (
                                    <tr key={incident.incident_id} className="border-b hover:bg-gray-100 even:bg-gray-50">
                                        <td className="p-3 flex items-center gap-2">
                                            {incident?.profile_image ? (
                                                <div
                                                    className="w-12 h-12 rounded-full"
                                                    style={{
                                                        backgroundImage: `url(http://${cfg.domainname}:${cfg.serverport}${blotter?.profile_image})`,
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
                                            <div className='flex flex-col leading-4 text-gray-500'>
                                                <span className='text-sm text-gray-500'>{`${incident.reporter_name}`}</span>
                                                <span className='text-xs text-gray-400'>{incident?.occupation || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-gray-500">{incident.incident_id}</td>
                                        <td className="p-3 text-gray-500">{incident.incident_type}</td>
                                        <td className="p-3 text-gray-500">{formatIncidentDate(incident.incident_date)}</td>
                                        <td className="p-3 text-gray-500 flex items-center justify-center gap-2">
                                            <div
                                                className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer' onClick={() => handleEditIncident(incident.incident_id)}>
                                                <GrEdit className='w-5 h-5 text-gray-500' />
                                            </div>
                                            <div className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer' onClick={() => handleViewIncident(incident.incident_id)}>
                                                <FaRegEye className='w-5 h-5 text-gray-500' />
                                            </div>
                                            <div
                                                className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer' onClick={() => handleDeleteConfirmation(incident?.incident_id)}>
                                                <FaRegTrashAlt className='w-5 h-5 text-red-500' />
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
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
            }

            <Pagination
                currentPage={currentPage}
                totalPages={totalIncidentPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange} />

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
                            await handleDeleteIncident();
                            setIsAlertDeleteOpen(false);
                        },
                    },
                ]}
            />
        </>
    )
}

export default BlotterIncidentPage