import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cfg from '../../../server/config/domain.js';
import { encryptId, decryptId } from '../utils/encryption.js';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDateFormatter } from '../hooks/useDateFormatter';

import Breadcrumbs from '../components/Breadcrumbs';
import SearchDropdown from '../components/SearchDropdown';
import SearchModal from "../components/SearchModal";
import InputDropdown from "../components/InputDropdown";
import AlertDialog from "../components/AlertDialog";

import { IoSearch } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";


const EditBlotterReportPage = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { formatIncidentDate } = useDateFormatter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const [blotterId, setBlotterId] = useState(null);
    const [blotterDetails, setBlotterDetails] = useState(null);

    const [selectedComplaintType, setSelectedComplaintType] = useState(null);
    const [selectedIncidentLocation, setSelectedIncidentLocation] = useState("");
    const [selectedIncidentDate, setSelectedIncidentDate] = useState("");

    //Complainant Details
    const [complainantId, setComplainantId] = useState(null);
    const [complainantName, setComplainantName] = useState("");
    const [complainantAddress, setComplainantAddress] = useState("");
    const [complainantContact, setComplainantContact] = useState("");

    const [currentDefendantIndex, setCurrentDefendantIndex] = useState(null);
    const [removeCurrentDefendantIndex, setRemoveCurrentDefendantIndex] = useState(null);
    const [defendants, setDefendants] = useState([{
        name: '',
        address: '',
        contact: ''
    }]);

    const [selectedWitnesses, setSelectedWitnesses] = useState([]);
    const [statement, setStatement] = useState("");

    //Modal States
    const [isComplainantModalOpen, setIsComplainantModalOpen] = useState(false);
    const [isDefendantModalOpen, setIsDefendantModalOpen] = useState(false);

    //Alert
    const [isAlertUpdateOpen, setIsAlertUpdateOpen] = useState(false);
    const [isAlertRemoveDefendantOpen, setIsAlertRemoveDefendantOpen] = useState(false);

    useEffect(() => {
        if (location.state?.blotter_id) {
            const id = location.state.blotter_id;
            setBlotterId(id);
            fetchBlotterReport(id);
        }
    }, [location]);

    const fetchBlotterReport = async (id) => {
        try {
            const response = await axios.get(
                `http://${cfg.domainname}:${cfg.serverport}/blotter/get/${id}`,
                { withCredentials: true }
            );

            if (response.status === 200) {

                const blotterData = response.data[0];

                setBlotterDetails(blotterData);
                setSelectedIncidentLocation(blotterData.incident_location || "");
                setSelectedIncidentDate(formatIncidentDate(blotterData.incident_date, 'yyyy-mm-dd') || "");
                setSelectedComplaintType(blotterData.incident_type);

                //Complainant Details
                setComplainantName(blotterData.complainant || "");
                setComplainantAddress(blotterData.address || "");
                setComplainantContact(blotterData.contact || "");

                try {
                    const parsedWitnesses = blotterData.witnesses ? JSON.parse(blotterData.witnesses) : [];
                    setSelectedWitnesses(Array.isArray(parsedWitnesses) ? parsedWitnesses : []);
                } catch (parseError) {
                    console.error("Error parsing attendees:", parseError);
                    setSelectedWitnesses([]);
                }

                // Parse defendants
                try {
                    const parsedDefendantNames = blotterData.defendants
                        ? JSON.parse(blotterData.defendants)
                        : [];
                    const parsedDefendantAddresses = blotterData.def_addresses
                        ? JSON.parse(blotterData.def_addresses)
                        : [];
                    const parsedDefendantContacts = blotterData.def_contacts
                        ? JSON.parse(blotterData.def_contacts)
                        : [];

                    const parsedDefendants = parsedDefendantNames.map((name, index) => ({
                        name: name || '',
                        address: parsedDefendantAddresses[index] || '',
                        contact: parsedDefendantContacts[index] || ''
                    }));

                    setDefendants(
                        parsedDefendants.length > 0
                            ? parsedDefendants
                            : [{ name: '', address: '', contact: '' }]
                    );
                } catch (parseError) {
                    console.error("Error parsing defendants:", parseError);
                    setDefendants([{ name: '', address: '', contact: '' }]);
                }

                setStatement(blotterData.notes || "");
            }
        } catch (error) {
            console.error("Error fetching blotter report:", error);
            setErrorMessage("Error fetching reporter ID:", error);
        }
    };

    const updateBlotterDetails = (field, value) => {
        const setterMap = {
            incident_type: setSelectedComplaintType,
            incident_location: setSelectedIncidentLocation,
            incident_date: setSelectedIncidentDate,
            complainant_id: setComplainantId,
            complainant_name: setComplainantName,
            complainant_address: setComplainantAddress,
            complainant_contact: setComplainantContact,
            notes: setStatement,
            witnesses: setSelectedWitnesses,
            defendants: setDefendants
        };

        if (setterMap[field]) {
            setterMap[field](value);
        }

        setBlotterDetails((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleComplaintTypeChange = (selectedValue) => {
        updateBlotterDetails('incident_type', selectedValue ? selectedValue.title : "");
    };

    const handleIncidentLocationChange = (e) => {
        updateBlotterDetails('incident_location', e.target.value);
    };

    const handleIncidentDateChange = (e) => {
        updateBlotterDetails('incident_date', e.target.value);
    };

    const handleSelectComplainant = (resident) => {
        updateBlotterDetails('complainant_id', resident.resident_id);
        updateBlotterDetails('complainant_name', `${resident.first_name} ${resident.last_name}`);
        updateBlotterDetails('complainant_address', `${resident.address || ""} ${resident.purok}, ${resident.barangay}`);
        updateBlotterDetails('complainant_contact', resident.contact_number || "");

        setIsComplainantModalOpen(false);
    };

    const handleDefendantChange = (index, field, value) => {
        setDefendants(prevDefendants => {
            const updatedDefendants = [...prevDefendants];
            updatedDefendants[index] = {
                ...updatedDefendants[index],
                [field]: value
            };
            return updatedDefendants;
        });
    };

    const addDefendant = () => {
        const lastDefendant = defendants[defendants.length - 1];

        if (!lastDefendant.name || !lastDefendant.address) {
            setErrorMessage("Please fill in all required fields for the current defendant before adding another.");
            return;
        }

        setDefendants([...defendants, { name: '', address: '', contact: '' }]);
        setErrorMessage(null);
    };

    const removeDefendant = (index) => {
        if (defendants.length === 1) {
            setErrorMessage("At least one defendant is required.");
            return;
        }

        setDefendants(prevDefendants =>
            prevDefendants.filter((_, i) => i !== index)
        );
        setErrorMessage(null);
    };

    const handleAddWitnessesChange = (item) => {
        setSelectedWitnesses((prevWitnesses) => {
            const updatedWitnesses = [...prevWitnesses, item];
            updateBlotterDetails('witnesses', updatedWitnesses);
            return updatedWitnesses;
        });
    };

    const handleRemoveWitnessesChange = (item) => {
        setSelectedWitnesses((prevWitnesses) => {
            const updatedWitnesses = prevWitnesses.filter((i) => i !== item);
            updateBlotterDetails('witnesses', updatedWitnesses);
            return updatedWitnesses;
        });
    };

    const handleStatementChange = (e) => {
        updateBlotterDetails('notes', e.target.value);
    };

    const prepareDefendantsForSubmission = () => {
        return {
            defendants: defendants.map(d => d.name),
            def_addresses: defendants.map(d => d.address),
            def_contacts: defendants.map(d => d.contact)
        };
    };

    const validateForm = () => {
        if (!selectedComplaintType) return "Complaint type is required.";
        if (!complainantName || !complainantAddress) return "Complainant details are incomplete.";
        if (defendants.some(d => !d.name || !d.address)) return "Defendant details are incomplete.";
        if (!statement.trim()) return "Statement is required.";
        return null;
    };

    const handleAlertUpdateBlotterReport = () => {
        const error = validateForm();
        if (error) {
            setErrorMessage(error);
            return;
        }

        setIsAlertUpdateOpen(true);
    }

    const handleUpdateBlotterReport = async () => {

        setIsLoading(true);

        try {
            const defendantData = prepareDefendantsForSubmission();

            const payload = {
                complainant_name: complainantName,
                complainant_address: complainantAddress,
                complainant_contact: complainantContact,
                witnesses: selectedWitnesses,
                incident_date: selectedIncidentDate,
                incident_type: selectedComplaintType,
                incident_location: selectedIncidentLocation,
                incident_description: "Sample Description",
                resolution: "Sample Resolution",
                notes: statement,
                ...defendantData
            };

            const response = await axios.put(`http://${cfg.domainname}:${cfg.serverport}/blotter/update/` + blotterId, payload, { withCredentials: true });

            if (response.status === 200) {
                setErrorMessage(null);

                navigate('/blotter-report', { state: { blotterToastType: "Update" } });
            }

        } catch (error) {
            console.error("Error updating blotter report:", error);
            setErrorMessage("Error updating blotter report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-grow p-6 bg-gray-100">
            <Breadcrumbs />
            <div className="mx-auto bg-white p-10 rounded-lg">
                <div className="mb-6 leading-3">
                    <div className="mb-4 leading-3">
                        <p className="text-lg font-semibold text-blue-500">
                            CR-#{blotterId || "N/A"}
                        </p>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-500">Edit Complaint</h1>
                    {blotterId ? (
                        <p className="text-sm text-gray-400 mt-2">Fill out the form below to edit the details of an existing complaint in the system.</p>

                    ) : (
                        <p className="text-red-500 text-sm mb-4 mt-2">
                            No blotter report selected.
                        </p>
                    )}
                </div>
                {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                <div className="col-span-1 md:col-span-3 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-gray-500">
                                Nature of Complain<span className="text-red-600">*</span>
                            </label>
                            <SearchDropdown
                                selectedValue={selectedComplaintType}
                                onSelect={handleComplaintTypeChange} />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-gray-500">
                                Incident Date<span className="text-red-600">*</span>
                            </label>
                            <input type="date" name="Incident Date" value={selectedIncidentDate} onChange={handleIncidentDateChange} className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-gray-500">
                                Incident Location<span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="Incident Location"
                                placeholder="Type Complainant Address"
                                className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedIncidentLocation}
                                onChange={handleIncidentLocationChange}
                            />
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
                                            value={defendant.name}
                                            onChange={(e) =>
                                                handleDefendantChange(index, "name", e.target.value)
                                            }
                                        />
                                        <div
                                            className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                            onClick={() => {
                                                setCurrentDefendantIndex(index);
                                                setIsDefendantModalOpen(true);
                                            }}
                                        >
                                            <IoSearch className="w-5 h-5 text-white" />
                                        </div>
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
                                        value={defendant.address}
                                        onChange={(e) =>
                                            handleDefendantChange(index, "address", e.target.value)
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
                                        value={defendant.contact}
                                        onChange={(e) =>
                                            handleDefendantChange(index, "contact", e.target.value)
                                        }
                                    />
                                </div>
                                {defendants.length > 1 && (
                                    <IoCloseCircleOutline
                                        className="w-5 h-5 absolute right-2 top-0 transform translate-x-1/2 text-red-500 cursor-pointer"
                                        onClick={() => {
                                            setIsAlertRemoveDefendantOpen(true);
                                            setRemoveCurrentDefendantIndex(index);
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                        <div className="flex-1 text-center">
                            <span
                                className="text-sm text-blue-500 cursor-pointer underline"
                                onClick={addDefendant}
                            >
                                Add More Defendant
                            </span>
                        </div>
                    </div>

                    {/* Witnesses */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="flex-1">
                            <label className="block mb-2 text-base font-medium text-gray-500">Witnesses</label>
                            <InputDropdown
                                title="Add Witnesses"
                                placeholder="Type Witnesses Name"
                                options={selectedWitnesses}
                                onAddValue={handleAddWitnessesChange}
                                onRemoveValue={handleRemoveWitnessesChange} />
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
                            onChange={handleStatementChange}
                        ></textarea>
                    </div>

                    <div className="col-span-1 md:col-span-3 flex justify-end mt-4 space-x-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-emerald-500 text-white py-2 px-4 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleAlertUpdateBlotterReport()}
                        >
                            {isLoading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>
            <SearchModal
                title="Select Defendant"
                isOpen={isDefendantModalOpen}
                onClose={() => {
                    setIsDefendantModalOpen(false);
                    setCurrentDefendantIndex(null);
                }}
                onSelect={(resident) => {
                    if (currentDefendantIndex !== null) {
                        handleDefendantChange(currentDefendantIndex, "name", `${resident.first_name} ${resident.last_name}`);
                        handleDefendantChange(currentDefendantIndex, "address", `${resident.address || ""} ${resident.purok}, ${resident.barangay}`);
                        handleDefendantChange(currentDefendantIndex, "contact", resident.contact_number);

                        setIsDefendantModalOpen(false);
                        setCurrentDefendantIndex(null);
                    }
                }}
            />

            <AlertDialog
                isOpen={isAlertUpdateOpen}
                message={"Are you sure you want to update this record? This action will process the record."}
                title="Update Confirmation"
                buttonConfig={[
                    {
                        label: "Cancel",
                        color: "bg-gray-200 text-gray-600",
                        action: () => setIsAlertUpdateOpen(false),
                    },
                    {
                        label: "Yes, Update",
                        color: "bg-emerald-500 text-white",
                        action: async () => {
                            await handleUpdateBlotterReport();
                            setIsAlertUpdateOpen(false);
                        },
                    },
                ]}
            />

            <AlertDialog
                isOpen={isAlertRemoveDefendantOpen}
                message={"Are you sure you want to remove this record? This action cannot be undone, and the record will be permanently removed."}
                title="Delete Confirmation"
                buttonConfig={[
                    {
                        label: "Cancel",
                        color: "bg-gray-200 text-gray-600",
                        action: () => setIsAlertRemoveDefendantOpen(false),
                    },
                    {
                        label: "Yes, Delete",
                        color: "bg-red-600 text-white",
                        action: async () => {
                            await removeDefendant(removeCurrentDefendantIndex);
                            setIsAlertRemoveDefendantOpen(false);
                            setRemoveCurrentDefendantIndex(null);
                        },
                    },
                ]}
            />
        </div>
    );
};

export default EditBlotterReportPage;
