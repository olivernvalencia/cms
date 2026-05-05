import React from "react";
import axios from "axios";
import cfg from "../../../server/config/domain";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegFileLines } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from "./AuthContext";

const BlotterList = ({ blotterData }) => {

    const navigate = useNavigate();
    const { barangayId } = useAuth();

    const [loading, setLoading] = useState(false);
    const [incidentData, setIncidentData] = useState([]);

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
        } finally {
            setLoading(false);
        }
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleViewBlotter = (id) => {
        navigate("/Blotter-Report/Blotter-Report-View", { state: { blotter_id: id } });
    };

    const handleViewIncident = (id) => {
        navigate("/blotter-report/incident-report-view", { state: { incident_id: id } });
    };

    return (
        <div className="p-4 bg-white rounded-md">
            <h3 className="text-gray-500 text-xl font-bold mb-4">Incident Report</h3>
            {blotterData
                .sort((a, b) => new Date(b.incident_date) - new Date(a.incident_date))
                .slice(0, 5)
                .map((incident) => (
                    <div
                        key={incident.blotter_id}
                        className="flex items-center bg-blue-50 rounded-md p-4 justify-between mb-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-200 rounded-full p-4">
                                <FaRegFileLines className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="leading-3 flex flex-col">
                                <span className="text-sm font-bold text-gray-500">
                                    {capitalizeFirstLetter(incident.incident_type)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Complaint Report ID:{" "}
                                    <span className="text-blue-500">#{incident.blotter_id}</span>
                                </span>
                                <span className="text-sm text-gray-500">
                                    Complainant:{" "}
                                    <span className="text-blue-500">{incident.complainant}</span>
                                </span>
                            </div>
                        </div>
                        <div onClick={() => handleViewBlotter(incident.blotter_id)} className="flex items-center gap-2 cursor-pointer">
                            <span className="text-sm text-blue-500">View</span>
                            <FaArrowRightLong className="w-3 h-3 text-blue-600" />
                        </div>
                    </div>
                ))
            }
            {
                incidentData?.map((incident) => (
                    <div
                        key={incident.incident_id}
                        className="flex items-center bg-blue-50 rounded-md p-4 justify-between mb-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-200 rounded-full p-4">
                                <FaRegFileLines className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="leading-3 flex flex-col">
                                <span className="text-sm font-bold text-gray-500">
                                    {capitalizeFirstLetter(incident.incident_type)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Incident Report ID:{" "}
                                    <span className="text-blue-500">#{incident.incident_id}</span>
                                </span>
                                <span className="text-sm text-gray-500">
                                    Reporter:{" "}
                                    <span className="text-blue-500">{incident.reporter_name}</span>
                                </span>
                            </div>
                        </div>
                        <div onClick={() => handleViewIncident(incident.incident_id)} className="flex items-center gap-2 cursor-pointer">
                            <span className="text-sm text-blue-500">View</span>
                            <FaArrowRightLong className="w-3 h-3 text-blue-600" />
                        </div>
                    </div>
                ))
            }
            <Link
                to="/blotter-report"
                className="flex items-center w-full justify-center gap-2 mt-4 text-center"
            >
                <span className="text-sm text-blue-500">View All</span>
                <FaArrowRightLong className="w-3 h-3 text-blue-600" />
            </Link>
        </div>
    );
};

export default BlotterList;

function IncidentCard() {
    return (
        <div>

        </div>
    )
}