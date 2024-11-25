import React, { useState } from 'react';
import { FaUser, FaCalendarAlt, FaTransgenderAlt, FaRing, FaBriefcase, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHome, FaIdCard, FaMapMarkedAlt } from 'react-icons/fa';
import { RxAvatar } from "react-icons/rx";

const ViewResidentModal = ({ isOpen, onClose, residentData }) => {
    const [activeTab, setActiveTab] = useState('Personal');

    if (!isOpen || !residentData) return null;

    const date = new Date(residentData.birthday);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg mx-4 shadow-lg">
                {/* Resident Header */}
                <div className="flex items-center mb-4">
                    <div className="bg-gray-200 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                        <RxAvatar className='w-16 h-16 text-gray-400' />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-500">
                            {residentData.FirstName} {residentData.LastName}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Resident ID: {residentData.ResidentID}
                        </p>
                    </div>

                    <span className={`ml-auto text-white px-3 py-1 rounded-full text-xs ${residentData.Status === "Active" ? "bg-green-500" : "bg-red-500"}`}>
                        {residentData.Status}
                    </span>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-400 mb-4">
                    <button
                        onClick={() => setActiveTab('Personal')}
                        className={`px-4 py-2 ${activeTab === 'Personal' ? 'border-b-2 border-blue-300 font-semibold text-blue-500' : 'text-gray-400'}`}
                    >
                        Personal
                    </button>
                    <button
                        onClick={() => setActiveTab('Contact')}
                        className={`px-4 py-2 ${activeTab === 'Contact' ? 'border-b-2 border-blue-300 font-semibold text-blue-500' : 'text-gray-400'}`}
                    >
                        Contact
                    </button>
                    <button
                        onClick={() => setActiveTab('Household')}
                        className={`px-4 py-2 ${activeTab === 'Household' ? 'border-b-2 border-blue-300 font-semibold text-blue-500' : 'text-gray-400'}`}
                    >
                        Household
                    </button>
                    <button
                        onClick={() => setActiveTab('Voter Info')}
                        className={`px-4 py-2 ${activeTab === 'Voter Info' ? 'border-b-2 border-blue-300 font-semibold text-blue-500' : 'text-gray-400'}`}
                    >
                        Voter Info
                    </button>
                </div>

                {/* Tab Content */}
                <div className="text-gray-700 mb-4">
                    {activeTab === 'Personal' && (
                        <div>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaUser className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Age:</span> {residentData.Age}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaCalendarAlt className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Birthday:</span> {formattedDate}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaTransgenderAlt className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Gender:</span> {residentData.Gender}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaRing className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Civil Status:</span> {residentData.CivilStatus}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaBriefcase className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Occupation:</span> {residentData.Occupation}
                            </p>
                        </div>
                    )}
                    {activeTab === 'Contact' && (
                        <div>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaPhone className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Contact Number:</span> {residentData.ContactNumber}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaEnvelope className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Email:</span> {residentData.Email}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaMapMarkerAlt className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Address:</span> {`${residentData.Address} ${residentData.Barangay} ${residentData.City} ${residentData.Province}`}
                            </p>
                        </div>
                    )}
                    {activeTab === 'Household' && (
                        <div>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaHome className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Household ID:</span> {residentData.HouseholdID}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaMapMarkedAlt className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Juan Bataan ID:</span> {residentData.JuanBataanID}
                            </p>
                        </div>
                    )}
                    {activeTab === 'Voter Info' && (
                        <div>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaIdCard className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Registered Voter:</span> {residentData.RegisteredVoter ? 'Yes' : 'No'}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaIdCard className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Voter ID Number:</span> {residentData.VoterIDNumber}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 mb-2">
                                <FaMapMarkedAlt className="mr-2 text-gray-400" />
                                <span className="text-gray-600 mr-2">Voting Precinct:</span> {residentData.VotingPrecinct}
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 w-full text-gray-800 hover:underline"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ViewResidentModal;
