import cfg from '../../../server/config/domain.js';
import React, { Suspense } from 'react';
const LazyPDFViewer = React.lazy(() => import('@react-pdf/renderer').then(module => ({ default: module.PDFViewer })));

import axios from 'axios';
import { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import ReportPreview from '../components/ReportPreview.jsx';
import { pdf } from '@react-pdf/renderer';
import { usePDF } from '@react-pdf/renderer';

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Breadcrumbs from '../components/Breadcrumbs.jsx';

import { IoPersonAddOutline, IoDocumentText } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { useAuth } from '../components/AuthContext.jsx';

const LoadingPDFPreview = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Generating PDF Preview</h3>
                <p className="text-sm text-gray-500">This may take a few moments...</p>
            </div>
        </div>
    );
};


const Reports = () => {

    const { barangayId } = useAuth();
    const [barangayOfficials, setBarangayOfficials] = useState(null);
    const [populationDetails, setPopulationDetails] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isLoadingPDF, setIsLoadingPDF] = useState(false);
    const [reportData, setReportData] = useState(null);

    const [instance, updateInstance] = usePDF({
        document: <ReportPreview />
    })

    useEffect(() => {
        if (barangayId) {
            fetchBarangayOfficials();
            fetchPopulationStats();
        }
    }, [barangayId]);

    const fetchBarangayOfficials = async () => {
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/official/` + barangayId, { withCredentials: true });

            if (response.status !== 200) throw new Error("Something went wrong with fetching data");

            setBarangayOfficials(response.data);

        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchPopulationStats = async () => {
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/stats/all-population-stats/` + barangayId, { withCredentials: true });

            if (response.status !== 200) throw new Error("Something went wrong with fetching data");

            setPopulationDetails(response.data);

        } catch (error) {
            console.error(error.message);
        }
    }

    const handleSelectReportData = async (data) => {
        try {
            setIsLoadingPDF(true); // Show loading indicator
            setReportData(data);
            console.log("Generating PDF...");

        } catch (error) {
            console.error("Error generating the PDF:", error);
        } finally {
            setIsLoadingPDF(false); // Hide loading indicator
        }
    };


    return (
        <div className="flex-grow p-6 bg-gray-100">
            <Breadcrumbs />
            <div className="mx-auto bg-white p-10 rounded-lg">
                <div className="flex gap-5 justify-between items-center mb-8">
                    <h1 className='text-4xl font-bold text-gray-500'>Barangay Overview</h1>
                    <button className='bg-blue-500 text-white px-5 py-3 text-sm flex items-center gap-2 rounded-full'
                        onClick={() => setIsReportModalOpen(true)}>
                        {/* <IoPersonAddOutline className='w-4 h-4 text-white font-bold' /> */}
                        Generate Report
                    </button>
                </div>

                <div className='leading-3 mb-8'>
                    <p className="text-2xl font-semibold text-blue-500 mb-2">About Our Barangay</p>
                    <p className="text-base text-gray-400 max-w-screen-lg">Barangay Colo, established in 1970, is a thriving community in Dinalupihan, Bataan. Known for its rich history and strong sense of unity, we strive to foster growth through sustainable initiatives, local engagement, and infrastructure development.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <div className="p-4 border-2 border-gray-300 rounded-md">
                        <p className='text-xl font-semibold text-blue-500 mb-2'>Barangay Officials</p>
                        <div className='flex border-b-2 border-gray-300 py-2'>
                            <p className='text-base flex-1 text-gray-500 font-semibold text-start pl-4'>Position</p>
                            <p className='text-base flex-1 text-gray-500 font-semibold text-center'>Name</p>
                        </div>

                        {
                            barangayOfficials?.map((official) => (
                                <div
                                    key={official.official_id}
                                    className="flex justify-around border-b-2 border-gray-300 text-base py-3 last:border-b-0"
                                >
                                    <p
                                        className="text-gray-400 font-medium flex-1 justify-start pl-4 text-ellipsis overflow-hidden whitespace-nowrap w-full"
                                        title={official.committee}
                                    >
                                        {official.committee}
                                    </p>

                                    <p className="flex-1 flex justify-center text-gray-400 font-medium text-center items-center">
                                        {official.full_name}
                                    </p>
                                </div>

                            ))
                        }
                    </div>
                    <div className="p-4 border-2 border-gray-300 rounded-md">
                        <p className='text-xl font-semibold text-blue-500 mb-2'>Quick Facts</p>
                        <div className='flex border-b-2 border-gray-300 py-2'>
                            <p className='text-base flex-1 text-gray-500 font-semibold text-start pl-4'>Title</p>
                            <p className='text-base flex-1 text-gray-500 font-semibold text-center'>Count</p>
                        </div>
                        {
                            <>
                                <Row title={"Poplutation"} count={populationDetails?.totalPopulation} />
                                <Row title={"Household"} count={populationDetails?.NumberOfHousehold} />
                                <Row title={"Senior Citizen"} count={populationDetails?.seniorCitizens} />
                                <Row title={"PWD"} count={populationDetails?.NumberOfPWD} />
                                <Row title={"Solo Parent"} count={populationDetails?.NumberOfsoloParent} />
                                <Row title={"Voters"} count={populationDetails?.NumberOfRegisteredVoters} />
                            </>
                        }
                    </div>
                </div>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onSubmit={handleSelectReportData}
                onClose={() => setIsReportModalOpen(false)}
            />

            {!isLoadingPDF && (
                <Suspense fallback={<LoadingPDFPreview />}>
                    <LazyPDFViewer style={{ width: '100%', height: '100vh' }}>
                        <ReportPreview data={reportData} />
                    </LazyPDFViewer>
                </Suspense>
            )}
        </div >
    )
}

export default Reports

function Row({ title, count }) {
    return <div
        className="flex justify-around border-b-2 border-gray-300 text-base py-3 last:border-b-0" >
        <p
            className="text-gray-400 font-medium flex-1 justify-start pl-4 text-ellipsis overflow-hidden whitespace-nowrap w-full">
            {title}
        </p>

        <p className="flex-1 flex justify-center text-gray-400 font-medium text-center items-center">
            {count}
        </p>
    </div>
}

function ReportModal({ isOpen, onClose, onSubmit, }) {

    const { barangayId } = useAuth();

    const [selectedReport, setSelectedReport] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [reportData, setReportData] = useState(null);

    const handleReportChange = (event) => {
        setSelectedReport(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedCategory || !barangayId) return;
            console.log(selectedCategory)
            try {
                let apiUrl = "";

                if (selectedCategory === "Household") {
                    apiUrl = `/get-household-head/${barangayId}`;
                } else if (selectedCategory === "Residents") {
                    apiUrl = `/get-residents/${barangayId}`;
                } else if (selectedCategory === "PWD") {
                    apiUrl = `/get-pwd/${barangayId}`;
                } else if (selectedCategory === "Solo Parent") {
                    apiUrl = `/get-solo-parent/${barangayId}`;
                } else if (selectedCategory === "Senior Citizen") {
                    apiUrl = `/get-senior-citizen/${barangayId}`;
                } else if (selectedCategory === "Youth") {
                    apiUrl = `/get-youth/${barangayId}`;
                } else {
                    return;
                }

                // else if (selectedCategory === "Purok Residents Count") {
                //     apiUrl = `/get-purok-residents-count/${barangayId}`;
                // } 

                const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/report/${apiUrl}`, { withCredentials: true });

                if (response.status === 200) {
                    console.log("API Data:", response.data);
                    setReportData(response.data);
                } else {
                    console.error("Error fetching data");
                }

            } catch (error) {
                console.error("Error in API call:", error.message);
            }
        };

        fetchData();
    }, [selectedCategory, barangayId]);

    const handleSelectReport = () => {
        onSubmit(reportData)
        setSelectedCategory("")
        setSelectedReport("");
        onClose();
    }

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-wrapper" role="modal">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 min-h-[350px]">
                    <div className='flex justify-between mb-4'>
                        <h2 className="text-xl font-semibold">Generate Reports</h2>
                        <IoClose
                            className='w-6 h-6 cursor-pointer'
                            onClick={() => onClose()}
                        />
                    </div>
                    <div className='flex-1'>
                        <div className='mb-4'>
                            <label className="block mb-1 text-lg font-medium text-gray-500">Type Of Reports</label>
                            <select
                                name="reportType"
                                className="border text-lg border-gray-300 p-2 w-full rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleReportChange}
                                value={selectedReport}
                            >
                                <option value="">Select Report Type</option>
                                <option value="Residents Reports">Residents Reports</option>
                                <option value="Blotter Report">Blotter Report</option>
                            </select>
                        </div>
                        <div className='mb-2'>
                            <label className="block mb-1 text-lg font-medium text-gray-500">Categories</label>
                            {selectedReport === "Residents Reports" && (
                                <select
                                    name="categories"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="border text-lg border-gray-300 p-2 w-full rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Categories</option>
                                    <option value="Household">Household</option>
                                    <option value="PWD">PWD</option>
                                    <option value="Residents">Residents</option>
                                    <option value="Senior Citizen">Senior Citizen</option>
                                    <option value="Solo Parent">Solo Parent</option>
                                    <option value="Youth">Youth</option>
                                </select>
                            )}
                        </div>
                        <div className='flex gap-4'>
                            <button className='bg-gray-200 w-full text-black px-5 py-3 text-sm flex items-center justify-center mt-4 gap-2 rounded-full' onClick={() => handleSelectReport()}>
                                Cancel
                            </button>
                            <button className='bg-blue-600 w-full text-white px-5 py-3 text-sm flex items-center justify-center mt-4 gap-2 rounded-full' onClick={() => handleSelectReport()}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}