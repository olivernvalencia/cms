import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import axios from 'axios';

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import cfg from '../../../server/config/config.js';

import { IoPersonAddOutline, IoDocumentText } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { GrEdit } from "react-icons/gr";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { PiCertificateBold } from "react-icons/pi";
import { Link } from "react-router-dom";

const ApplicationRequest = () => {
    const { barangayId } = useAuth();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCertificateRequest();
    }, [barangayId]);

    async function fetchCertificateRequest() {
        setLoading(true);
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/certificate/` + barangayId, {
                withCredentials: true,
            });
            setRequests(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching blotters data:", error);
            setError("Failed to fetch blotters. Please try again later.");
        }
        finally {
            setLoading(false);
        }
    }


    const filteredRequest = requests?.filter(request => {
        const applicantName = `${request.applicant || ''}`.toLowerCase();
        const certificationId = request.certification_id != null
            ? request.certification_id.toString()
            : '';
        return applicantName.includes(searchQuery.toLowerCase()) ||
            certificationId.includes(searchQuery.toLowerCase())
    });

    const totalFilteredPages = Math.ceil((filteredRequest?.length) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedRequest = filteredRequest?.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => setCurrentPage(page);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                console.error('Invalid date:', dateString);
                return 'Invalid Date';
            }

            return date.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'N/A';
        }
    };


    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row flex-grow">
                <Sidebar />
                <main className="flex-grow p-4 bg-gray-100">
                    <div className="flex-grow p-6 bg-gray-100">
                        <Breadcrumbs />
                        <h1 className='text-2xl font-bold text-gray-500 mb-6'>Application Request</h1>
                        <div className='flex items-center justify-between mb-6'>
                            <div className='relative max-w-96 w-full'>
                                <Search
                                    searchQuery={searchQuery}
                                    onSearchChange={handleSearchChange}
                                />
                            </div>
                            <div className="flex gap-5">
                                <button className='bg-blue-600 text-white px-5 py-3 text-sm flex items-center gap-2 rounded-full' onClick={() => navigate("/application-request/add-certification")}>
                                    <PiCertificateBold className='w-4 h-4 text-white font-bold' />
                                    Request Certification
                                </button>
                            </div>
                        </div>
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                        {
                            loading ? (<div className="text-center">Loading...</div>
                            ) :
                                (
                                    <div className="overflow-x-auto mt-4">
                                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm">
                                            <thead className='bg-gray-200'>
                                                <tr>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Applicant Name</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Certificate/Permit ID</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Type of request</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Issuance Date</th>
                                                    <th className="text-center p-3 font-semibold text-gray-700">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filteredRequest?.length > 0 ? displayedRequest.map((request) => (
                                                        <tr key={request.certification_id} className="border-b hover:bg-gray-100 even:bg-gray-50">
                                                            <td className="p-3 flex items-center gap-2">
                                                                <div className='bg-gray-200 rounded-full'>
                                                                    <RxAvatar className='w-8 h-8 text-gray-400' />
                                                                </div>
                                                                <div className='flex flex-col leading-4 text-gray-500'>
                                                                    <span className='text-sm text-gray-500'>{`${request.applicant}`}</span>
                                                                    <span className='text-xs text-gray-400'>{request?.occupation || 'N/A'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-3 text-gray-500">{request.certification_id}</td>
                                                            <td className="p-3 text-gray-500">{request.certification_type}</td>
                                                            <td className="p-3 text-gray-500">{formatDate(request.date_issued)}</td>
                                                            <td className="p-3 text-gray-500 flex items-center justify-center gap-2">
                                                                <div
                                                                    className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer'>
                                                                    <GrEdit className='w-5 h-5 text-gray-500' />
                                                                </div>
                                                                <div className='bg-gray-200 p-2 w-max rounded-lg cursor-pointer'>
                                                                    <Link>
                                                                        <FaRegEye className='w-5 h-5 text-gray-500' />
                                                                    </Link>
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
    )
}

export default ApplicationRequest