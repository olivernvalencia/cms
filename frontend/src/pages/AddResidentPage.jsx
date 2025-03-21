import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import cfg from '../../../server/config/domain.js';

import { BsFillPersonVcardFill } from "react-icons/bs";
import { MdContactPhone } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import { FaFileUpload } from 'react-icons/fa';
import { FaMapLocationDot } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";


const AddResidentPage = ({ setSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        MiddleName: '',
        Suffix: '',
        birthday: '',
        BirthPlace: '',
        Gender: '',
        Address: '',
        Region_ID: '',
        Province_ID: '',
        City_ID: '',
        Barangay_ID: '',
        Purok_ID: '',
        IsLocalResident: false,
        ResidentType: '',
        ContactNumber: '',
        Email: '',
        CivilStatus: '',
        Occupation: '',
        IsSoloParent: false,
        SoloParentID: '',
        IsPWD: false,
        PWDID: '',
        IsHouseholdHead: false,
        HouseholdID: '',
        IsRegisteredVoter: false,
        VoterIDNumber: '',
        IsJuanBataanMember: false,
        JuanBataanID: '',
        Profile_Image: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [allRegion, setAllRegion] = useState([]);
    const [allProvinces, setAllProvinces] = useState([]);
    const [allCities, setAllCities] = useState([]);
    const [allBarangay, setAllBarangay] = useState([]);
    const [allPuroks, setAllPuroks] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');
    const [selectedPurok, setSelectedPurok] = useState('');
    const [fileName, setFileName] = useState("");

    const handleFilesChange = (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : ""); // Update the file name or clear it
    };

    const handleOptionRemove = () => {
        setFileName(""); // Reset the file name
    };


    useEffect(() => {
        fetchAllRegion();
    }, []);

    useEffect(() => {
        if (selectedRegion) {
            fetchAllProvince(selectedRegion);
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedProvince) {
            fetchAllCity(selectedProvince);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedCity) {
            fetchAllBarangay(selectedCity);
        }
    }, [selectedCity]);

    useEffect(() => {
        if (selectedBarangay) {
            fetchAllPurok(selectedBarangay);
        }
    }, [selectedBarangay]);

    const fetchAllRegion = async () => {
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/location/region`, { withCredentials: true });
            setAllRegion(response.data);
        } catch (error) {
            console.error("Error fetching all Region:", error)
        }
    }

    const fetchAllProvince = async () => {
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/location/provinces/${selectedRegion}`, { withCredentials: true });
            const provinces = response.data;
            setAllProvinces(provinces);

            if (provinces.length > 0) {
                const defaultProvince = provinces[0].iid;
                setSelectedProvince(defaultProvince);
                setFormData((prevState) => ({
                    ...prevState,
                    Province_ID: defaultProvince,
                }));
            } else {
                setSelectedProvince('');
                setAllCities([]);
                setSelectedCity('');
                setFormData((prevState) => ({
                    ...prevState,
                    Province_ID: '',
                    City_ID: '',
                    Barangay_ID: '',
                }));
            }
        } catch (error) {
            console.error("Error fetching all Provinces:", error);
        }
    };

    const fetchAllCity = async () => {
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/location/cities/${selectedProvince}`, { withCredentials: true });
            const cities = response.data;
            setAllCities(cities);

            if (cities.length > 0) {
                const defaultCity = cities[0].iid;
                setSelectedCity(defaultCity);
                setFormData((prevState) => ({
                    ...prevState,
                    City_ID: defaultCity,
                }));
            } else {
                setSelectedCity('');
                setAllBarangay([]);
                setSelectedBarangay('');
                setFormData((prevState) => ({
                    ...prevState,
                    City_ID: '',
                    Barangay_ID: '',
                }));
            }
        } catch (error) {
            console.error("Error fetching all Cities:", error);
        }
    };

    const fetchAllBarangay = async () => {
        try {
            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/location/barangay/${selectedCity}`, { withCredentials: true });
            const barangays = response.data;
            setAllBarangay(barangays);

            if (barangays.length > 0) {
                const defaultBarangay = barangays[0].iid;
                setSelectedBarangay(defaultBarangay);
                setFormData((prevState) => ({
                    ...prevState,
                    Barangay_ID: defaultBarangay,
                }));
            } else {
                setSelectedBarangay('');
                setFormData((prevState) => ({
                    ...prevState,
                    Barangay_ID: '',
                }));
            }
        } catch (error) {
            console.error("Error fetching all Barangays:", error);
        }
    };

    const fetchAllPurok = async () => {
        try {
            // Ensure selectedBarangay is not empty
            if (!selectedBarangay) {
                setAllPuroks([]);
                return;
            }

            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/location/purok/${selectedBarangay}`, { withCredentials: true });
            const puroks = response.data;
            setAllPuroks(puroks);

            if (puroks.length > 0) {
                const defaultPurok = puroks[0].iid;
                setSelectedPurok(defaultPurok);
                setFormData((prevState) => ({
                    ...prevState,
                    Purok_ID: defaultPurok,
                }));
            } else {
                setSelectedPurok('');
                setFormData((prevState) => ({
                    ...prevState,
                    Purok_ID: '',
                }));
            }
        } catch (error) {
            console.error("Error fetching all Puroks:", error);
            // Optionally, set an error state or show a user-friendly message
            setAllPuroks([]);
            setSelectedPurok('');
        }
    };

    const handleRegionChange = (e) => {
        const regionId = e.target.value;
        setSelectedRegion(regionId);
        setFormData(prevState => ({
            ...prevState,
            Region_ID: regionId,
            Province_ID: '',
            City_ID: '',
            Barangay_ID: '',
            Purok_ID: ''
        }));
    };

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setFormData(prevState => ({
            ...prevState,
            Province_ID: provinceId,
            City_ID: '',
            Barangay_ID: '',
            Purok_ID: ''
        }));
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        setFormData(prevState => ({
            ...prevState,
            City_ID: cityId,
            Barangay_ID: '',
            Purok_ID: ''
        }));
    };

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        setSelectedBarangay(barangayId);
        setFormData(prevState => ({
            ...prevState,
            Barangay_ID: barangayId,
            Purok_ID: ''
        }));
    };

    const handlePurokChange = (e) => {
        const purokId = e.target.value;
        setSelectedPurok(purokId);
        setFormData(prevState => ({
            ...prevState,
            Purok_ID: purokId
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(name, value);
    };

    const handleIsHouseholdHead = (e) => {
        setFormData(prevData => ({
            ...prevData,
            IsHouseholdHead: e.target.value === 'yes' ? 1 : 0,
        }));
    };

    const handleIsRegisteredVoter = (e) => {
        setFormData(prevData => ({
            ...prevData,
            IsRegisteredVoter: e.target.value === 'yes' ? 1 : 0,
        }));
    };

    const handleIsLocalResident = (e) => {
        setFormData(prevData => ({
            ...prevData,
            IsLocalResident: e.target.value === 'yes' ? 1 : 0,
        }));
    }

    const handleIsJuanBataanMember = (e) => {
        setFormData(prevData => ({
            ...prevData,
            IsJuanBataanMember: e.target.value === 'yes' ? 1 : 0
        }));
    };

    const handleIsPwd = (e) => {
        setFormData(prevData => ({
            ...prevData,
            IsPWD: e.target.value === 'yes' ? 1 : 0
        }));
    };

    const handleIsSoloParent = (e) => {
        setFormData(prevData => ({
            ...prevData,
            IsSoloParent: e.target.value === 'yes' ? 1 : 0
        }));
    }


    const handleCancel = () => {
        navigate('/resident-management');
    }

    const validateFormData = async () => {
        // Define required fields
        const requiredFields = [
            'first_name',
            'last_name',
            'age',
            'birthday',
            'gender',
            'address',
            'contact_number'
        ];

        // Check required fields
        for (let field of requiredFields) {
            if (!formData[field] || formData[field].toString().trim() === '') {
                setErrorMessage(`${field.replace('_', ' ')} is required`);
                return false;
            }
        }

        // Additional validations
        if (formData.age && (isNaN(formData.age) || formData.age <= 0)) {
            setErrorMessage('Age must be a positive number');
            return false;
        }

        if (formData.ContactNumber && !/^\d{10,15}$/.test(formData.ContactNumber)) {
            setErrorMessage('Contact Number must be a valid phone number (10-15 digits)');
            return false;
        }

        if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
            setErrorMessage('Email must be a valid email address');
            return false;
        }

        if (formData.birthday) {
            const birthdayDate = new Date(formData.birthday);
            if (isNaN(birthdayDate.getTime())) {
                setErrorMessage('Birthday must be a valid date');
                return false;
            }

            const today = new Date();
            if (birthdayDate > today) {
                setErrorMessage('Birthday cannot be in the future');
                return false;
            }
        }

        if (formData.Gender && !['Male', 'Female', 'Other'].includes(formData.Gender)) {
            setErrorMessage('Gender must be Male, Female, or Other');
            return false;
        }

        if (formData.IsRegisteredVoter) {
            if (!formData.VoterIDNumber || formData.VoterIDNumber.trim() === '') {
                setErrorMessage('Voter ID Number is required for registered voters');
                return false;
            }
        }

        if (formData.IsJuanBataanMember) {
            if (!formData.JuanBataanID || formData.JuanBataanID.trim() === '') {
                setErrorMessage('Juan Bataan ID is required for Juan Bataan members');
                return false;
            }
        }

        // Check for duplicate contact number
        try {
            const response = await axios.post('/check-duplicate-contact', {
                contact_number: formData.ContactNumber
            });

            if (response.data.isDuplicate) {
                setErrorMessage('Duplicate entry found: The contact number is already in use.');
                return false;
            }
        } catch (error) {
            setErrorMessage('Error checking for duplicate contact number. Please try again later.');
            return false;
        }

        // Validation passed
        setErrorMessage(''); // Clear any existing errors
        return true;
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setFormData(prevData => ({
    //             ...prevData,
    //             Profile_Image: file  // Store the actual file object
    //         }));
    //     }
    // };

    const handleAddResident = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        if (!validateFormData()) {
            setLoading(false);
            return;
        }

        // Create FormData object
        const formDataToSubmit = new FormData();

        // Get the file input element and append file if it exists
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput && fileInput.files[0]) {
            formDataToSubmit.append('Profile_Image', fileInput.files[0]);
        }

        // Append all other form fields
        Object.keys(formData).forEach(key => {
            if (key !== 'Profile_Image') {  // Skip the file input
                if (key === 'birthday' && formData[key]) {
                    formDataToSubmit.append(key, new Date(formData[key]).toISOString().split('T')[0]);
                } else if (typeof formData[key] === 'boolean') {
                    formDataToSubmit.append(key, formData[key] ? '1' : '0');
                } else if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSubmit.append(key, formData[key]);
                }
            }
        });

        try {
            const response = await axios.post(
                `http://${cfg.domainname}:${cfg.serverport}/residents/add`,
                formDataToSubmit,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            sessionStorage.setItem('residentAddedSuccess', 'true');
            navigate('/resident-management');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to save resident');
        } finally {
            setLoading(false);
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
                        <div className="mx-auto bg-white p-10 rounded-lg">
                            <div className="mb-6 leading-3">
                                <h1 className="text-xl font-semibold text-gray-500">Add New Resident</h1>
                                <p className="text-sm text-gray-400 mt-2">Fill out the form below to add a new resident to the system.</p>
                            </div>
                            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                            <form onSubmit={handleAddResident} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Personal Details Section */}
                                <div className="col-span-1 md:col-span-3 mb-4">
                                    <div className='flex items-center gap-3 mb-4'>
                                        <BsFillPersonVcardFill className='w-6 h-6 text-gray-400' />
                                        <h2 className="text-sm font-bold text-gray-500">Personal Details</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">First Name</label>
                                            <input type="text" name="FirstName" value={formData.FirstName} onChange={handleChange} placeholder="First Name" required className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Last Name</label>
                                            <input type="text" name="LastName" value={formData.LastName} onChange={handleChange} placeholder="Last Name" required className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className='flex gap-4'>
                                            <div className='flex-2'>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">Middle Name</label>
                                                <input type="text" name="MiddleName" value={formData.MiddleName} onChange={handleChange} placeholder="Middle Name" className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div className='flex-1'>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">Suffix</label>
                                                <select
                                                    name="Suffix"
                                                    value={formData.Suffix || ''}
                                                    onChange={handleChange}
                                                    className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Suffix</option>
                                                    <option value="Jr.">Jr.</option>
                                                    <option value="Sr.">Sr.</option>
                                                    <option value="II">II</option>
                                                    <option value="III">III</option>
                                                    <option value="IV">IV</option>
                                                    <option value="V">V</option>
                                                    <option value="">None</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Birthday</label>
                                            <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Birth Place</label>
                                            <input type="text" name="BirthPlace" placeholder='Birth Place' value={formData.BirthPlace} onChange={handleChange} className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Occupation</label>
                                            <input type="text" name="Occupation" value={formData.Occupation} onChange={handleChange} placeholder="Occupation" className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">
                                                Civil Status
                                            </label>
                                            <select name="CivilStatus" value={formData.CivilStatus} onChange={handleChange} className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="">Select Civil Status</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Gender</label>
                                            <select
                                                name="Gender"
                                                value={formData.Gender || ''}
                                                onChange={handleChange}
                                                required
                                                className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="relative w-full">
                                            <label className="block mb-2 text-sm font-medium text-gray-500">
                                                Upload Profile Image
                                            </label>
                                            <div className="relative flex items-center justify-between border-dashed border-2 bg-gray-100 border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                                                <input
                                                    type="file"
                                                    name="Profile_Image"
                                                    onChange={handleFilesChange}
                                                    accept="image/jpeg,image/png"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                    <FaFileUpload className="w-5 h-5 text-gray-500" />
                                                    {fileName ? (
                                                        <span className="font-semibold text-gray-700 truncate">{fileName}</span>
                                                    ) : (
                                                        <span>Choose a file (JPEG, PNG)</span>
                                                    )}
                                                </div>
                                                {fileName && (
                                                    <IoCloseCircleOutline
                                                        onClick={handleOptionRemove}
                                                        className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
                                                        title="Remove file"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information Section */}
                                <div className="col-span-1 md:col-span-3 mb-4">
                                    <div className='flex items-center gap-3 mb-4'>
                                        <FaMapLocationDot className='w-6 h-6 text-gray-400' />
                                        <h2 className="text-sm font-bold text-gray-500">Address Information</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Region</label>
                                            <select
                                                value={selectedRegion || ''}
                                                name='Region_ID'
                                                onChange={handleRegionChange}
                                                className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Region</option>
                                                {allRegion.map((region) => (
                                                    <option value={region.iid} key={region.iid}>{region.iname}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Province</label>
                                            <select
                                                value={selectedProvince || ''}
                                                name='Province_ID'
                                                onChange={handleProvinceChange}
                                                disabled={!selectedRegion}
                                                className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {allProvinces.length > 0 ? (
                                                    allProvinces.map((province) => (
                                                        <option value={province.iid} key={province.iid}>{province.iname}</option>
                                                    ))
                                                ) : (
                                                    <option value="">No Provinces Available</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">City</label>
                                            <select
                                                value={selectedCity || ''}
                                                name='City_ID'
                                                onChange={handleCityChange}
                                                disabled={!selectedProvince}
                                                className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {allCities.length > 0 ? (
                                                    allCities.map((city) => (
                                                        <option value={city.iid} key={city.iid}>{city.iname}</option>
                                                    ))
                                                ) : (
                                                    <option value="">No Cities Available</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Barangay</label>
                                            <select
                                                value={selectedBarangay || ''}
                                                name='Barangay_ID'
                                                onChange={handleBarangayChange}
                                                disabled={!selectedCity}
                                                className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {allBarangay.length > 0 ? (
                                                    allBarangay.map((barangay) => (
                                                        <option value={barangay.iid} key={barangay.iid}>{barangay.iname}</option>
                                                    ))
                                                ) : (
                                                    <option value="">No Barangay Available</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Purok</label>
                                            <select
                                                value={selectedPurok || ''}
                                                name='Purok_ID'
                                                onChange={handlePurokChange}
                                                disabled={!selectedBarangay}
                                                className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {allPuroks.length > 0 ? (
                                                    allPuroks.map((purok) => (
                                                        <option value={purok.iid} key={purok.iid}>{purok.iname}</option>
                                                    ))
                                                ) : (
                                                    <option value="">No Puroks Available</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">House No.</label>
                                            <input type="text" name="Address" value={formData.Address} onChange={handleChange} placeholder='House No.' required className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">
                                                Resident Type
                                            </label>
                                            <select name="ResidentType" value={formData.ResidentType} onChange={handleChange} className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="">Select Resident Type</option>
                                                <option value="Permanent">Permanent</option>
                                                <option value="Tenant">Tenant</option>
                                                <option value="Business Owner">Business Owner</option>
                                            </select>
                                        </div>
                                        <div>
                                            <div className='leading-3 mb-4'>
                                                <label className="block text-sm font-medium text-gray-500">Are you a local resident?</label>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="IsLocalResident"
                                                        value="yes"
                                                        checked={formData.IsLocalResident === 1}
                                                        onChange={handleIsLocalResident}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="IsLocalResident"
                                                        value="no"
                                                        checked={formData.IsLocalResident === 0}
                                                        onChange={handleIsLocalResident}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information Section */}
                                <div className='col-span-1 md:col-span-3 mb-4'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <MdContactPhone className='w-6 h-6 text-gray-400' />
                                        <h2 className="text-sm font-bold text-gray-500">Contact Information</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Contact Number</label>
                                            <input type="text" name="ContactNumber" value={formData.ContactNumber} onChange={handleChange} placeholder='XXXXXXXXXXXX' required className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Email</label>
                                            <input type="email" name="Email" value={formData.Email} onChange={handleChange} placeholder='JohnDoe@email.com' className="border border-gray-300 p-2 w-full text-sm rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Household Information Section */}
                                <div className="col-span-1 md:col-span-3 mb-4">
                                    <div className='flex items-center gap-3 mb-4'>
                                        <IoIosInformationCircle className='w-6 h-6 text-gray-400' />
                                        <h2 className="text-sm font-bold text-gray-500">Other Information</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 mb-4 gap-6">
                                        <div>
                                            <div className='leading-3 mb-4'>
                                                <label className="block text-sm font-medium text-gray-500">Are you head of the family?</label>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="IsHouseholdHead"
                                                        value="yes"
                                                        checked={formData.IsHouseholdHead === 1}
                                                        onChange={handleIsHouseholdHead}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="IsHouseholdHead"
                                                        value="no"
                                                        checked={formData.IsHouseholdHead === 0}
                                                        onChange={handleIsHouseholdHead}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Household ID</label>
                                            <input type="text" name="HouseholdID" value={formData.HouseholdID} onChange={handleChange} placeholder='XXX-XX-XX' className="border text-sm text-gray-500 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 mb-4 gap-6">
                                        <div>
                                            <div className='leading-3 mb-4'>
                                                <label className="block text-sm font-medium text-gray-500">Are you Barangay Registered Voter?</label>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="IsRegisteredVoter"
                                                        value="yes"
                                                        checked={formData.IsRegisteredVoter === 1}
                                                        onChange={handleIsRegisteredVoter}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="IsRegisteredVoter"
                                                        value="no"
                                                        checked={formData.IsRegisteredVoter === 0}
                                                        onChange={handleIsRegisteredVoter}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Voter ID</label>
                                            <input type="text" name="VoterIDNumber" value={formData.VoterIDNumber} onChange={handleChange} placeholder='XXX-XX-XX' className="border text-sm text-gray-500 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 mb-4 gap-6">
                                        <div>
                                            <div className='leading-3 mb-4'>
                                                <label className="block text-sm font-medium text-gray-500">Are you a member of One Bataan?</label>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="IsJuanBataanMember"
                                                        value="yes"
                                                        checked={formData.IsJuanBataanMember === 1}
                                                        onChange={handleIsJuanBataanMember}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="IsJuanBataanMember"
                                                        value="no"
                                                        checked={formData.IsJuanBataanMember === 0}
                                                        onChange={handleIsJuanBataanMember}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">One Bataan ID</label>
                                            <input type="text" name="JuanBataanID" value={formData.JuanBataanID} onChange={handleChange} placeholder='XXX-XX-XX' className="border text-sm text-gray-500 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 mb-4 gap-6">
                                        <div>
                                            <div className='leading-3 mb-4'>
                                                <label className="block text-sm font-medium text-gray-500">Are you a member of PWD?</label>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="IsPWD"
                                                        value="yes"
                                                        checked={formData.IsPWD === 1}
                                                        onChange={handleIsPwd}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="IsPWD"
                                                        value="no"
                                                        checked={formData.IsPWD === 0}
                                                        onChange={handleIsPwd}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">PWD ID</label>
                                            <input type="text" name="PWDID" value={formData.PWDID} onChange={handleChange} placeholder='XXX-XX-XX' className="border text-sm text-gray-500 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 mb-4 gap-6">
                                        <div>
                                            <div className='leading-3 mb-4'>
                                                <label className="block text-sm font-medium text-gray-500">Are you a member of Solo Parent?</label>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="IsSoloParent"
                                                        value="yes"
                                                        checked={formData.IsSoloParent === 1}
                                                        onChange={handleIsSoloParent}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="IsSoloParent"
                                                        value="no"
                                                        checked={formData.IsSoloParent === 0}
                                                        onChange={handleIsSoloParent}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Solo Parent ID</label>
                                            <input type="text" name="SoloParentID" value={formData.SoloParentID} onChange={handleChange} placeholder='XXX-XX-XX' className="border text-sm text-gray-500 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-3 flex justify-end mt-4 space-x-4">
                                    <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400">Cancel</button>
                                    <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300">{loading ? 'Saving...' : 'Add Resident'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>

    );
};

export default AddResidentPage;
