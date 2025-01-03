import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import SearchDropdown from "../components/SearchDropdown";
import SearchModal from "../components/SearchModal";
import cfg from '../../../server/config/config.js';

import { IoSearch } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";

const AddIncidentReportPage = () => {

    const { barangayId } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isComplainantModalOpen, setIsComplainantModalOpen] = useState(false);
    const [isDefendantModalOpen, setIsDefendantModalOpen] = useState(false);

    //Complainant Details and Form Data
    const [selectedComplaintType, setSelectedComplaintType] = useState(null);
    const [selectedIncidentDate, setSelectedIncidentDate] = useState("");
    const [selectedIncidentLocation, setSelectedIncidentLocation] = useState("");
    const [complainantId, setComplainantId] = useState(null);
    const [complainantName, setComplainantName] = useState("");
    const [complainantAddress, setComplainantAddress] = useState("");
    const [complainantContact, setComplainantContact] = useState("");
    // const [defendants, setDefendants] = useState([
    //     { name: "", address: "", contact: "" }
    // ]);

    const [defendants, setDefendants] = useState([]);
    const [defendantAddresses, setDefendantAddresses] = useState([]);
    const [defendantContacts, setDefendantContacts] = useState([]);

    const [statement, setStatement] = useState("");

    // const addDefendant = () => {
    //     if (defendants[0].name === "" || defendants[0].address === "" || defendants[0].contact === "") {
    //         return;
    //     }
    //     setDefendants([...defendants, { name: "", address: "", contact: "" }]);
    // };

    // const handleDefendantChange = (index, fieldData) => {
    //     setDefendants((prevDefendants) =>
    //         prevDefendants.map((defendant, i) =>
    //             i === index ? { ...defendant, ...fieldData } : defendant
    //         )
    //     );
    // };

    // const removeDefendant = (index) => {
    //     if (defendants.length > 1) {
    //         setDefendants((prevDefendants) =>
    //             prevDefendants.filter((_, i) => i !== index)
    //         );
    //     } else {
    //         alert("There must always be at least one defendant.");
    //     }
    // };

    // Modify the initial state to include the first defendant
    const addInitialDefendant = () => {
        setDefendants([""]);
        setDefendantAddresses([""]);
        setDefendantContacts([""]);
    };

    useEffect(() => {
        addInitialDefendant();
    }, []);

    const addDefendant = () => {
        setDefendants([...defendants, ""]);
        setDefendantAddresses([...defendantAddresses, ""]);
        setDefendantContacts([...defendantContacts, ""]);
    };

    const handleDefendantChange = (index, field, value) => {
        if (field === "name") {
            const newDefendants = [...defendants];
            newDefendants[index] = value;
            setDefendants(newDefendants);
        } else if (field === "address") {
            const newAddresses = [...defendantAddresses];
            newAddresses[index] = value;
            setDefendantAddresses(newAddresses);
        } else if (field === "contact") {
            const newContacts = [...defendantContacts];
            newContacts[index] = value;
            setDefendantContacts(newContacts);
        }
    };

    const removeDefendant = (index) => {
        if (defendants.length === 1) {
            setErrorMessage("At least one defendant is required.");
            return;
        }

        setDefendants((prev) => prev.filter((_, i) => i !== index));
        setDefendantAddresses((prev) => prev.filter((_, i) => i !== index));
        setDefendantContacts((prev) => prev.filter((_, i) => i !== index));
    };

    const handleComplaintTypeChange = (selectedValue) => {
        setSelectedComplaintType(selectedValue)
    };

    const handleSelectComplainant = (resident) => {
        setComplainantId(resident.resident_id);
        setComplainantName(`${resident.first_name} ${resident.last_name}`);
        setComplainantAddress(`${resident.address || ""} ${resident.purok}, ${resident.barangay}`);
        setComplainantContact(resident.contact_number || "");
        setIsComplainantModalOpen(false);
    }

    const validateForm = () => {
        if (!selectedComplaintType) return "Complaint type is required.";
        if (!complainantName || !complainantAddress) return "Complainant details are incomplete.";
        if (defendants.some((name) => !name) || defendantAddresses.some((address) => !address))
            return "Defendant details are incomplete.";
        if (!statement.trim()) return "Statement is required.";
        return null;
    };

    const handleSubmit = async () => {
        const error = validateForm();
        if (error) {
            setErrorMessage(error);
            return;
        }

        const payload = {
            incident_date: selectedIncidentDate,
            reporter_id: 13,
            complainant_id: complainantId,
            complainant_name: complainantName,
            complainant_address: complainantAddress,
            complainant_contact: complainantContact,
            defendants: defendants.filter(Boolean),
            defendantAddresses: defendantAddresses.filter(Boolean),
            defendantContacts: defendantContacts.filter(Boolean),
            witnesses: "Sample Witnesses",
            incident_type: selectedComplaintType?.title,
            incident_location: selectedIncidentLocation,
            incident_description: "Sample Description",
            resolution: "Sample Resolution",
            notes: statement,
            barangay_id: barangayId
        };
        console.log(payload);

        setIsLoading(true);
        try {
            const response = await axios.post(`http://${cfg.domainname}:${cfg.serverport}/blotter/add`, payload, { withCredentials: true });
            console.log(response);
            if (response.status === 201) {
                setSuccessMessage("Blotter added successfully!");
                setErrorMessage(null);

                // Reset form state
                setSelectedComplaintType(null);
                setComplainantName("");
                setComplainantAddress("");
                setComplainantContact("");
                setDefendants([]);
                setDefendantAddresses([]);
                setDefendantContacts([]);
                setStatement("");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row flex-grow">
                <Sidebar />
                <main className="flex-grow p-4 bg-gray-100">
                    <div className="flex-grow p-6 bg-gray-100">
                        <Breadcrumbs />
                        <div className="mx-auto bg-white p-10 rounded-lg">
                            <div className="mb-6 leading-3">
                                <h1 className="text-xl font-semibold text-gray-500">Add Complaint</h1>
                                <p className="text-sm text-gray-400 mt-2">Fill out the form below to add a new complaint to the system.</p>
                            </div>
                            {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
                            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                            <div className="col-span-1 md:col-span-3 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className='flex-1'>
                                        <label className="block mb-2 text-sm font-medium text-gray-500">Nature of Complain<span className="text-red-600">*</span></label>
                                        <SearchDropdown onSelect={handleComplaintTypeChange} />
                                    </div>
                                    <div className='flex-1'>
                                        <label className="block mb-2 text-sm font-medium text-gray-500">Incident Date<span className="text-red-600">*</span></label>
                                        <input type="date" name="Incident Date" value={selectedIncidentDate} onChange={(e) => setSelectedIncidentDate(e.target.value)} className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className='flex-1'>
                                        <label className="block mb-2 text-sm font-medium text-gray-500">Incident Location<span className="text-red-600">*</span></label>
                                        <input type="text" name="Incident Location" placeholder="Type Complainant Address" className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={selectedIncidentLocation} onChange={(e) => setSelectedIncidentLocation(e.target.value)} />
                                    </div>
                                </div>
                                {/* Complainant Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className='flex-1'>
                                        <label className="block mb-2 text-sm font-medium text-gray-500">Complainant Name<span className="text-red-600">*</span></label>
                                        <div className="relative rounded-md ">
                                            <input type="text" name="ComplaintName" placeholder="Type or Search Complainant Name" className=" text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md  focus:ring-2 focus:ring-blue-500" value={complainantName} onChange={(e) => setComplainantName(e.target.value)} />
                                            <div className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md" onClick={() => setIsComplainantModalOpen((prev) => !prev)}>
                                                <IoSearch className="w-5 h-5 text-white" />
                                            </div>
                                            <SearchModal
                                                title="Select Complainant"
                                                isOpen={isComplainantModalOpen}
                                                onClose={() => setIsComplainantModalOpen(false)}
                                                onSelect={handleSelectComplainant} />
                                        </div>
                                    </div>
                                    <div className='flex-1'>
                                        <label className="block mb-2 text-sm font-medium text-gray-500">Address<span className="text-red-600">*</span></label>
                                        <input type="text" name="Address" placeholder="Type Complainant Address" className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={complainantAddress} onChange={(e) => setComplainantAddress(e.target.value)} />

                                    </div>
                                    <div className='flex-1'>
                                        <label className="block mb-2 text-sm font-medium text-gray-500">Contact Number</label>
                                        <input type="text" name="ComplaintContactNumber" placeholder="Type Complainant Contact Number" className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={complainantContact} onChange={(e) => setComplainantContact(e.target.value)} />
                                    </div>
                                </div>

                                {/* Defendant Details */}
                                <div className="grid grid-cols-1 gap-6 mb-8">
                                    {defendants.map((defendant, index) => (

                                        <div key={index} className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                                            <div className="flex-1">
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Defendant/Respondent Name<span className="text-red-600">*</span>
                                                </label>
                                                <div className="relative rounded-md">
                                                    <input
                                                        type="text"
                                                        placeholder="Type or Search Defendant Name"
                                                        className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                                        value={defendant}
                                                        onChange={(e) =>
                                                            handleDefendantChange(index, "name", e.target.value)
                                                        }
                                                    />
                                                    <div className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md" onClick={() => setIsDefendantModalOpen((prev) => !prev)}>
                                                        <IoSearch className="w-5 h-5 text-white" />
                                                    </div>
                                                    <SearchModal
                                                        title="Select Defendant"
                                                        isOpen={isDefendantModalOpen}
                                                        onClose={() => setIsDefendantModalOpen(false)}
                                                        onSelect={(resident) => {
                                                            handleDefendantChange(index, "name", `${resident.first_name} ${resident.last_name}`);
                                                            handleDefendantChange(index, "address", `${resident.address || ""} ${resident.purok}, ${resident.barangay}`);
                                                            handleDefendantChange(index, "contact", resident.contact_number);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Address<span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Type Defendant Address"
                                                    className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={defendantAddresses[index]}
                                                    onChange={(e) =>
                                                        handleDefendantChange(
                                                            index,
                                                            "address",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Contact Number
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Type Defendant Contact Number"
                                                    className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={defendantContacts[index]}
                                                    onChange={(e) =>
                                                        handleDefendantChange(
                                                            index,
                                                            "contact",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <IoCloseCircleOutline className="w-5 h-5 absolute right-2 top-0 transform translate-x-1/2 text-red-500 cursor-pointer" onClick={() => removeDefendant(index)} />
                                        </div>

                                    ))}
                                    <div className="flex-1 text-center">
                                        <span className="text-sm text-blue-500 cursor-pointer underline" onClick={addDefendant}>Add More Complainee</span>
                                    </div>
                                </div>

                                {/* Statement */}
                                <div className="mb-8">
                                    <label className="block mb-2 text-sm font-medium text-gray-500">Statement<span className="text-red-600">*</span></label>
                                    <textarea
                                        className="border text-sm border-gray-300 p-2 h-48 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        name="certificateDetails"
                                        placeholder="Type complainant statement"
                                        value={statement}
                                        onChange={(e) => setStatement(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="col-span-1 md:col-span-3 flex justify-end mt-4 space-x-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`bg-blue-500 text-white py-2 px-4 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={handleSubmit}
                                    >
                                        {isLoading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>


                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>

    );
}

export default AddIncidentReportPage