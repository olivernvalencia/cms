import axios from "axios";
import cfg from '../../../server/config/domain.js';
import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import Pagination from '../components/Pagination.jsx';
import Search from '../components/Search.jsx';
import SearchDropdown from "../components/SearchDropdown.jsx";
import SearchModal from "../components/SearchModal.jsx";
import SearchModalDynamic from "../components/SearchModalDynamic";
import InputDropdown from "../components/InputDropdown.jsx";
import AlertDialog from "../components/AlertDialog.jsx";

import { IoSearch } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";

const AddIncidentReportPage = () => {

    const { barangayId } = useAuth();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReporterModalOpen, setIsReporterModalOpen] = useState(false);

    const [selectedIncidentType, setSelectedIncidentType] = useState(null);
    const [selectedIncidentDate, setSelectedIncidentDate] = useState("");
    const [selectedIncidentLocation, setSelectedIncidentLocation] = useState("");

    const [reporterId, setReporterId] = useState(null);
    const [reporterName, setReporterName] = useState("");
    const [reporterAddress, setReporterAddress] = useState("");
    const [reporterContact, setReporterContact] = useState("");

    const [incidentStatement, setIncidentStatement] = useState("");

    //Alert
    const [isAlertSubmitOpen, setIsAlertSubmitOpen] = useState(false);

    const handleIncidentTypeChange = (selectedValue) => {
        setSelectedIncidentType(selectedValue)
    };

    const handleSelectReporter = (reporter) => {
        setReporterId(reporter?.id);
        setReporterName(`${reporter?.fullname}`);
        setReporterAddress(`${reporter?.brgy_name}, ${reporter?.city_name}, ${reporter?.province_name}`);
        setReporterContact(reporter?.contact_number || "");
        setIsReporterModalOpen(false);
    }

    const handleCloseReporterModal = () => {
        setIsReporterModalOpen(false);
    }

    const validateForm = () => {
        if (!selectedIncidentType) return "Incident type is required.";
        if (!selectedIncidentDate) return "Incident date is required.";
        if (!selectedIncidentLocation) return "Incident location is required.";
        if (!reporterName || !reporterAddress) return "Reporter details are incomplete.";
        if (!incidentStatement.trim()) return "Incident Statement is required.";
        return null;
    };

    const handleAlertSubmit = async () => {
        const error = validateForm();
        if (error) {
            setErrorMessage(error);
            resetError();
            return;
        }

        setIsAlertSubmitOpen(true);
    };

    const handleSubmit = async () => {

        const payload = {
            incident_date: selectedIncidentDate,
            reporter_id: reporterId,
            reporter_name: reporterName,
            reporter_address: reporterAddress,
            reporter_contact: reporterContact,
            incident_type: selectedIncidentType.title,
            incident_location: selectedIncidentLocation,
            incident_statement: incidentStatement,
            barangay_id: barangayId
        };

        setIsLoading(true);

        try {
            const response = await axios.post(`http://${cfg.domainname}:${cfg.serverport}/incident/add/incident-report`, payload, { withCredentials: true });
            if (response.status === 201) {
                setErrorMessage(null);

                //Navigate
                navigate('/blotter-report', { state: { incidentToastType: 'Add' } });
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    }

    const resetError = () => {
        setTimeout(() => {
            setErrorMessage("");
        }, 4000);
    };

    return (
        <div className="flex-grow p-6 bg-gray-100">
            <Breadcrumbs />
            <div className="mx-auto bg-white p-10 rounded-lg">
                <div className="mb-6 leading-3">
                    <h1 className="text-xl font-semibold text-gray-500">Add Incident</h1>
                    <p className="text-sm text-gray-400 mt-2">Fill out the form below to add a new incident to the system.</p>
                </div>
                {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                <div className="col-span-1 md:col-span-3 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className='flex-1'>
                            <label className="block mb-2 text-sm font-medium text-gray-500">Nature of Incident<span className="text-red-600">*</span></label>
                            <SearchDropdown
                                title="Select Incident Type"
                                placeholder="Search Incident Type"
                                selectedValue={selectedIncidentType?.title}
                                onSelect={handleIncidentTypeChange} />
                        </div>
                        <div className='flex-1'>
                            <label className="block mb-2 text-sm font-medium text-gray-500">Incident Date<span className="text-red-600">*</span></label>
                            <input type="date" name="Incident Date" value={selectedIncidentDate} onChange={(e) => setSelectedIncidentDate(e.target.value)} className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className='flex-1'>
                            <label className="block mb-2 text-sm font-medium text-gray-500">Incident Location<span className="text-red-600">*</span></label>
                            <input type="text" name="Incident Location" placeholder="Type Incident Location" className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={selectedIncidentLocation} onChange={(e) => setSelectedIncidentLocation(e.target.value)} />
                        </div>
                    </div>

                    {/* Reporter Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className='flex-1'>
                            <label className="block mb-2 text-sm font-medium text-gray-500">Reporter Name<span className="text-red-600">*</span></label>
                            <div className="relative rounded-md ">
                                <input type="text" name="ComplaintName" placeholder="Search Reporter Name" className=" text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md  focus:ring-2 focus:ring-blue-500" value={reporterName} onChange={(e) => setReporterName(e.target.value)} disabled />
                                <div className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md" onClick={() => setIsReporterModalOpen(true)}>
                                    <IoSearch className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className='flex-1'>
                            <label className="block mb-2 text-sm font-medium text-gray-500">Address<span className="text-red-600">*</span></label>
                            <input type="text" name="Address" placeholder="Type Reporter Address" className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={reporterAddress} onChange={(e) => setReporterAddress(e.target.value)} />

                        </div>
                        <div className='flex-1'>
                            <label className="block mb-2 text-sm font-medium text-gray-500">Contact Number</label>
                            <input type="text" name="ComplaintContactNumber" placeholder="Type Reporter Contact Number" className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={reporterContact} onChange={(e) => setReporterContact(e.target.value)} />
                        </div>
                    </div>

                    {/* Statement */}
                    <div className="mb-8">
                        <label className="block mb-2 text-sm font-medium text-gray-500">Statement<span className="text-red-600">*</span></label>
                        <textarea
                            className="border text-sm border-gray-300 p-2 h-48 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            name="certificateDetails"
                            placeholder="Type incident statement"
                            value={incidentStatement}
                            onChange={(e) => setIncidentStatement(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="col-span-1 md:col-span-3 flex justify-end mt-4 space-x-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-blue-500 text-white py-2 px-4 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleAlertSubmit()}
                        >
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>

            <SearchModalDynamic
                isOpen={isReporterModalOpen}
                title="Select a reporter"
                onClose={() => handleCloseReporterModal()}
                onSelect={(reporter) => handleSelectReporter(reporter)}
                options={{
                    fetchUrl: `http://${cfg.domainname}:${cfg.serverport}/user/` + barangayId,
                    filterFunction: (user, searchTerm) =>
                        `${user.fullname}`.toLowerCase().includes(searchTerm.toLowerCase()),
                    renderItem: (user) => (
                        <>
                            <RxAvatar className="w-10 h-10 text-gray-400" />
                            <div className="ml-4">
                                <h3 className="font-bold text-gray-800">{`${user.fullname}`}</h3>
                            </div>
                        </>
                    )
                }}
            />

            <AlertDialog
                isOpen={isAlertSubmitOpen}
                message={"Are you sure you want to submit this record? This action will process the record."}
                title="Submit Confirmation"
                buttonConfig={[
                    {
                        label: "Cancel",
                        color: "bg-gray-200 text-gray-600",
                        action: () => setIsAlertSubmitOpen(false),
                    },
                    {
                        label: "Yes, Submit",
                        color: "bg-emerald-500 text-white",
                        action: async () => {
                            await handleSubmit();
                            setIsAlertSubmitOpen(false);
                        },
                    },
                ]}
            />
        </div>
    )
}

export default AddIncidentReportPage