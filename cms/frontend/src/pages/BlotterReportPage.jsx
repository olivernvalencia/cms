import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

import Breadcrumbs from "../components/Breadcrumbs";
import ToastMessage from "../components/ToastMessage.jsx";
import Tabs from "../components/Tabs.jsx";

import BlotterComplaintPage from "../pages/BlotterComplaintPage";
import BlotterIncidentPage from "../pages/BlotterIncidentPage";

const IncidentReport = () => {

    const location = useLocation();
    const navigate = useNavigate();

    //Toast
    const [showSuccessToastComplaint, setShowSuccessToastComplaint] = useState(false);
    const [showDeleteToastComplaint, setShowDeleteToastComplaint] = useState(false);
    const [showSuccessToastIncident, setShowSuccessToastIncident] = useState(false);
    const [showDeleteToastIncident, setShowDeleteToastIncident] = useState(false);

    const [complaintToastType, setComplaintToastType] = useState("");
    const [incidentToastType, setIncidentToastType] = useState("");

    useEffect(() => {
        const incidentToastType = location.state?.incidentToastType ?? "";

        if (incidentToastType) {
            setIncidentToastType(incidentToastType);

            setShowSuccessToastIncident(incidentToastType === "Add" || incidentToastType === "Update");
            setShowDeleteToastIncident(incidentToastType === "Delete");

            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    useEffect(() => {
        const blotterToastType = location.state?.blotterToastType ?? "";

        if (blotterToastType) {
            setComplaintToastType(blotterToastType);

            setShowSuccessToastComplaint(blotterToastType === "Add" || blotterToastType === "Update");
            setShowDeleteToastComplaint(blotterToastType === "Delete");

            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    return (
        <div className="flex-grow p-6 bg-gray-100">
            <Breadcrumbs />
            <h1 className='text-2xl font-bold text-gray-500 mb-4'>Blotter Report</h1>

            <Tabs id="blotterActiveTab" tabs={[
                { label: "Complaint", content: <BlotterComplaintPage /> },
                { label: "Incident", content: <BlotterIncidentPage /> },
            ]} />

            <ToastMessage
                message={`Blotter record ${complaintToastType === "Add" ? "added" : "updated"} successfully!`}
                variant="default"
                isVisible={showSuccessToastComplaint}
                duration={3000}
                onClose={() => setShowSuccessToastComplaint(false)}
            />

            <ToastMessage
                message="Blotter record successfully deleted!"
                variant="delete"
                isVisible={showDeleteToastComplaint}
                duration={3000}
                onClose={() => setShowDeleteToastComplaint(false)}
            />

            {/* Incident Toast Messages */}
            <ToastMessage
                message={`Incident record ${incidentToastType === "Add" ? "added" : "updated"} successfully!`}
                variant="default"
                isVisible={showSuccessToastIncident}
                duration={3000}
                onClose={() => setShowSuccessToastIncident(false)}
            />

            <ToastMessage
                message="Incident record successfully deleted!"
                variant="delete"
                isVisible={showDeleteToastIncident}
                duration={3000}
                onClose={() => setShowDeleteToastIncident(false)}
            />
        </div>
    );
};

export default IncidentReport;