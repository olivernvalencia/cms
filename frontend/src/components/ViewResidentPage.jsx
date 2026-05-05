import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaTransgenderAlt, FaRing, FaBriefcase, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHome, FaIdCard, FaMapMarkedAlt } from 'react-icons/fa';
import { RxAvatar } from "react-icons/rx";
import { IoArrowBack } from "react-icons/io5";
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import cfg from '../../../server/config/domain';

const ViewResidentPage = ({ residentData, onClose }) => {
    const [activeTab, setActiveTab] = useState('Personal');
    const navigate = useNavigate();

    if (!residentData) return null;

    const date = new Date(residentData.birthday);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row flex-grow">
                <Sidebar />
                <main className="flex-grow p-4 bg-gray-100">
                    <div className="flex-grow p-6 bg-gray-100">
                        <Breadcrumbs />
                        <div className="mx-auto bg-white p-10 rounded-lg">

                            {/* Back Button */}
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 mb-6"
                            >
                                <IoArrowBack className="w-4 h-4" />
                                Back to Residents
                            </button>

                            {/* Resident Header */}
                            <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                                <div className="bg-gray-200 rounded-full h-24 w-24 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {residentData.profile_image ? (
                                        <div
                                            className="w-full h-full rounded-full"
                                            style={{
                                                backgroundImage: `url(http://${cfg.domainname}:${cfg.serverport}${residentData.profile_image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                            role="img"
                                            aria-label="Resident"
                                        />
                                    ) : (
                                        <RxAvatar className="w-16 h-16 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <h1 className="text-2xl font-bold text-gray-600">
                                        {residentData.first_name} {residentData.middle_name} {residentData.last_name} {residentData.suffix}
                                    </h1>
                                    <p className="text-sm text-gray-400 mt-1">Resident ID: {residentData.resident_id}</p>
                                    <div className="mt-2">
                                        <span className={`text-white px-3 py-1 rounded-full text-xs ${residentData.Status === "Active" ? "bg-green-500" : "bg-red-500"}`}>
                                            {residentData.Status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200 mb-6">
                                {['Personal', 'Contact', 'Household', 'Voter Info'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                                            activeTab === tab
                                                ? 'border-b-2 border-blue-500 text-blue-500'
                                                : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {activeTab === 'Personal' && (
                                    <>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Age</p>
                                            <div className="flex items-center gap-2">
                                                <FaUser className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.age}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Birthday</p>
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{formattedDate}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Gender</p>
                                            <div className="flex items-center gap-2">
                                                <FaTransgenderAlt className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.gender}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Civil Status</p>
                                            <div className="flex items-center gap-2">
                                                <FaRing className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.civil_status}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Occupation</p>
                                            <div className="flex items-center gap-2">
                                                <FaBriefcase className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.occupation || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Birth Place</p>
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.birth_place || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'Contact' && (
                                    <>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Contact Number</p>
                                            <div className="flex items-center gap-2">
                                                <FaPhone className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.contact_number || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Email</p>
                                            <div className="flex items-center gap-2">
                                                <FaEnvelope className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                                            <p className="text-xs text-gray-400 mb-1">Address</p>
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">
                                                    {residentData.address} {residentData.purok} {residentData.barangay}, {residentData.city}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'Household' && (
                                    <>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Household ID</p>
                                            <div className="flex items-center gap-2">
                                                <FaHome className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.household_id || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">One Bataan ID</p>
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkedAlt className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.juan_bataan_id || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Household Head</p>
                                            <div className="flex items-center gap-2">
                                                <FaHome className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.is_household_head ? 'Yes' : 'No'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">PWD</p>
                                            <div className="flex items-center gap-2">
                                                <FaIdCard className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.is_pwd ? 'Yes' : 'No'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Solo Parent</p>
                                            <div className="flex items-center gap-2">
                                                <FaIdCard className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.is_solo_parent ? 'Yes' : 'No'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Local Resident</p>
                                            <div className="flex items-center gap-2">
                                                <FaHome className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.is_local_resident ? 'Yes' : 'No'}</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'Voter Info' && (
                                    <>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Registered Voter</p>
                                            <div className="flex items-center gap-2">
                                                <FaIdCard className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.is_registered_voter ? 'Yes' : 'No'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-400 mb-1">Voter ID Number</p>
                                            <div className="flex items-center gap-2">
                                                <FaIdCard className="text-blue-400 w-4 h-4" />
                                                <p className="text-sm font-medium text-gray-600">{residentData.voter_id_number || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ViewResidentPage;