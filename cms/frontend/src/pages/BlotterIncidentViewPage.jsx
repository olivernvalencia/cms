import axios from "axios";
import cfg from '../../../server/config/domain.js';
import React, { useEffect, useState, } from "react";
import { useAuth } from "../components/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useDateFormatter } from '../hooks/useDateFormatter';

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
import Loader from "../components/Loader.jsx";

import { IoSearch } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";

const BlotterIncidentViewPage = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { formatIncidentDate } = useDateFormatter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const [incidentId, setIncidentId] = useState(null);
    const [incidentDetails, setIncidentDetails] = useState([]);

    const [isReporterModalOpen, setIsReporterModalOpen] = useState(false);

    const [selectedIncidentType, setSelectedIncidentType] = useState(null);
    const [selectedIncidentDate, setSelectedIncidentDate] = useState("");
    const [selectedIncidentLocation, setSelectedIncidentLocation] = useState("");

    const [reporterId, setReporterId] = useState(null);
    const [reporterName, setReporterName] = useState("");
    const [reporterAddress, setReporterAddress] = useState("");
    const [reporterContact, setReporterContact] = useState("");

    const [incidentStatement, setIncidentStatement] = useState("");

    useEffect(() => {
        if (location?.state?.incident_id) {
            const id = location.state.incident_id;
            setIncidentId(id);
            fetchIncident(id);
        }
    }, [location])

    const fetchIncident = async (id) => {
        try {
            setIsLoading(true);

            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/incident/get-incident/${id}`, { withCredentials: true });

            if (response.status === 200) {
                const incidentData = response.data[0];

                setIncidentDetails(incidentData);

                setSelectedIncidentType(incidentData.incident_type);
                setSelectedIncidentDate(formatIncidentDate(incidentData.incident_date, 'yyyy-mm-dd') || "")
                setSelectedIncidentLocation(incidentData.incident_location || "");
                setReporterId(incidentData?.cbs_user_id);
                setReporterName(incidentData.reporter_name || "");
                setReporterAddress(incidentData.address || "");
                setReporterContact(incidentData.contact ?? "");
                setIncidentStatement(incidentData.incident_statement);
            }

        } catch (error) {
            console.error("Error fetching incident report:", error);
            setErrorMessage("Error fetching incident:", error);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex-grow p-6 bg-gray-100 h-full">
            <Breadcrumbs />
            {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
            {
                isLoading
                    ? (<Loader type="block" />)
                    : (<>
                        <div className="mx-auto bg-white p-10 rounded-lg mb-12">
                            <div className="mb-6 leading-3">
                                <h1 className="text-lg font-semibold text-blue-500">
                                    IR-#{incidentDetails?.incident_id}
                                </h1>
                            </div>
                            <div className="col-span-1">

                                {/* Reporters Details */}
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6 border-b-2 pb-6">
                                    <h2 className='text-lg font-bold text-gray-500'>Incident Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className='flex-1'>
                                            <label className="mb-1 font-medium text-gray-500">Nature of Incident: </label>
                                            <span className="text-gray-400">{selectedIncidentType ?? "N/A"}</span>
                                        </div>
                                        <div className='flex-1'>
                                            <label className="mb-1 font-medium text-gray-500">Date: </label>
                                            <span className="text-gray-400">{formatIncidentDate(selectedIncidentDate) ?? "N/A"}</span>
                                        </div>
                                        <div className='flex-1'>
                                            <label className="mb-1 font-medium text-gray-500">Location: </label>
                                            <span className="text-gray-400">{selectedIncidentLocation ?? "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reporters Details */}
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6 border-b-2 pb-6">
                                    <h2 className='text-lg font-bold text-gray-500'>Reporter</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className='flex-1'>
                                            <label className="mb-1 font-medium text-gray-500">Name: </label>
                                            <span className="text-gray-400">{reporterName ?? "N/A"}</span>
                                        </div>
                                        <div className='flex-1'>
                                            <label className="mb-1 font-medium text-gray-500">Address: </label>
                                            <span className="text-gray-400">{reporterAddress ?? "N/A"}</span>
                                        </div>
                                        <div className='flex-1'>
                                            <label className="mb-1 font-medium text-gray-500">Contact Number: </label>
                                            <span className="text-gray-400">{reporterContact || "N/A"}</span>
                                        </div>
                                        <div className='flex-1'>
                                            <label className="mb-1 font-medium text-gray-500">Date of Filling: </label>
                                            <span className="text-gray-400">{formatIncidentDate(incidentDetails?.report_date) ?? "N/A"}</span>
                                        </div>

                                    </div>
                                </div>

                                {/* Statement Details */}
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    <h2 className="text-lg font-bold text-gray-500">Statements</h2>
                                    <p className="text-gray-400 max-w-screen-lg">
                                        {incidentStatement ?? "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                    )
            }
        </div>
    )
}

export default BlotterIncidentViewPage