import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDateFormatter } from "../hooks/useDateFormatter";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import StatusBadge from "../components/StatusBadge";
import cfg from '../../../server/config/config.js';

import { IoPersonAddOutline, IoDocumentText } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { GrEdit } from "react-icons/gr";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const IncidentReport = () => {

    const { barangayId } = useAuth();
    const { formatIncidentDate } = useDateFormatter();
    const navigate = useNavigate();

    const [blotters, setBlotters] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        fetchBlotters();
    }, [barangayId]);

    async function fetchBlotters() {
        setLoading(true);
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/blotter/` + barangayId, {
                withCredentials: true,
            });
            setBlotters(response.data);
        } catch (error) {
            console.error("Error fetching blotters data:", error);
            setError("Failed to fetch blotters. Please try again later.");
        }
        finally {
            setLoading(false);
        }
    }

    const filteredBlotters = blotters?.filter(blotter => {
        const complainantName = `${blotter.complainant || ''}`.toLowerCase();
        const blotterId = blotter.blotter_id != null
            ? blotter.blotter_id.toString()
            : '';
        return complainantName.includes(searchQuery.toLowerCase()) ||
            blotterId.includes(searchQuery.toLowerCase())
    });
    const totalFilteredPages = Math.ceil((filteredBlotters?.length) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedBlotters = filteredBlotters?.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => setCurrentPage(page);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleViewBlotter = (id) => {
        navigate("/Blotter-Report/Blotter-Report-View", { state: { blotter_id: id } });
    };

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row flex-grow">
                <Sidebar />
                <main className="flex-grow p-4 bg-gray-100">
                    <div className="flex-grow p-6 bg-gray-100">
                        <Breadcrumbs />
                        <h1 className='text-2xl font-bold text-gray-500 mb-6'>Blotter Report</h1>
                        <div className='flex items-center justify-between mb-6'>
                            <div className='relative max-w-96 w-full'>
                                <Search
                                    searchQuery={searchQuery}
                                    onSearchChange={handleSearchChange}
                                />
                            </div>
                            <div className="flex gap-5">
                                <button className='border-2 border-blue-600 text-blue-600 px-5 py-3 text-sm flex items-center gap-2 rounded-full'>
                                    <IoDocumentText className='w-4 h-4 text-blue-600  font-bold' />
                                    Add Incident
                                </button>
                                <button className='bg-blue-600 text-white px-5 py-3 text-sm flex items-center gap-2 rounded-full' onClick={() => navigate("/blotter-report/add-complaint")}>
                                    <IoPersonAddOutline className='w-4 h-4 text-white font-bold' />
                                    Add Complaint
                                </button>
                            </div>
                        </div>
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                        {
                            loading ? (<div className="text-center">Loading...</div>
                            ) :
                                (
                                    <div className="overflow-x-auto rounded-lg mt-4">
                                        <table className="min-w-full bg-white shadow-md overflow-hidden text-sm">
                                            <thead className='bg-gray-200'>
                                                <tr>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Complainant Name</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Incident Report ID</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Nature of Incident</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Incident Date</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                                                    <th className="text-center p-3 font-semibold text-gray-700">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filteredBlotters.length > 0 ? displayedBlotters.map((blotter) => (
                                                        <tr key={blotter.blotter_id} className="border-b hover:bg-gray-100 even:bg-gray-50">
                                                            <td className="p-3 flex items-center gap-2">
                                                                <div className='bg-gray-200 rounded-full'>
                                                                    <RxAvatar className='w-8 h-8 text-gray-400' />
                                                                </div>
                                                                <div className='flex flex-col leading-4 text-gray-500'>
                                                                    <span className='text-sm text-gray-500'>{`${blotter.complainant}`}</span>
                                                                    <span className='text-xs text-gray-400'>{blotter?.occupation || 'N/A'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-3 text-gray-500">{blotter.blotter_id}</td>
                                                            <td className="p-3 text-gray-500">{blotter.incident_type}</td>
                                                            <td className="p-3 text-gray-500">{formatIncidentDate(blotter.incident_date)}</td>
                                                            <td className="p-3 text-gray-500">{<StatusBadge status={blotter.status} />}</td>
                                                            <td className="p-3 text-gray-500 flex items-center justify-center gap-2">
                                                                <div
                                                                    className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer'>
                                                                    <GrEdit className='w-5 h-5 text-gray-500' />
                                                                </div>
                                                                <div className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer' onClick={() => handleViewBlotter(blotter?.blotter_id)}>
                                                                    <FaRegEye className='w-5 h-5 text-gray-500' />
                                                                </div>
                                                                <div
                                                                    className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer'>
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
                                )
                        }

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalFilteredPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={handleItemsPerPageChange} />
                    </div>
                </main>
            </div >
        </div >
    );
};

export default IncidentReport;