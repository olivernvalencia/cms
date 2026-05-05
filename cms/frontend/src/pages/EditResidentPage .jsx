import React, { useState, useEffect } from 'react';
import axios from 'axios';;
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import { BsFillPersonVcardFill } from "react-icons/bs";
import { MdContactPhone } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";
import { FaFileUpload } from 'react-icons/fa';
import { FaMapLocationDot } from "react-icons/fa6";
import cfg from '../../../server/config/domain.js';

const EditResidentPage = ({ }) => {
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', middle_name: '', suffix: '', birthday: '', birth_place: '', gender: '', address: '',
        region_id: '', province_id: '', city_id: '', barangay_id: '', purok_id: '',
        is_local_resident: false, resident_type: '', contact_number: '', email: '',
        is_solo_parent: false, solo_parent_id: '', is_pwd: false, pwd_id: '',
        civil_status: '', occupation: '', is_household_head: false, household_id: '',
        is_registered_voter: false, voter_id_number: '', is_juan_bataan_member: false,
        juan_bataan_id: '', profile_image: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { residentData } = location.state || {};
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
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

    useEffect(() => {
        if (residentData) {
            setFormData({
                ...residentData,
                birthday: formatDate(residentData.birthday),
                RegistrationDate: formatDate(residentData.RegistrationDate),
            });
            setSelectedRegion(residentData.region_id);
            setSelectedProvince(residentData.province_id);
            setSelectedCity(residentData.city_id);
            setSelectedBarangay(residentData.barangay_id);
            setSelectedPurok(residentData.purok_id);
            console.log(residentData);
        }
    }, [residentData]);

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
                const currentProvince = provinces.find(province => province.iid === residentData.province_id);
                setSelectedProvince(currentProvince.iid);
                setFormData((prevState) => ({
                    ...prevState,
                    province_id: currentProvince.iid,
                }));
            } else {
                setSelectedProvince('');
                setAllCities([]);
                setSelectedCity('');
                setFormData((prevState) => ({
                    ...prevState,
                    province_id: '',
                    city_id: '',
                    barangay_id: '',
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
                const currentCity = cities.find(city => city.iid === residentData.city_id);
                setSelectedCity(currentCity.iid);
                setFormData((prevState) => ({
                    ...prevState,
                    city_id: currentCity.iid,
                }));
            } else {
                setSelectedCity('');
                setAllBarangay([]);
                setSelectedBarangay('');
                setFormData((prevState) => ({
                    ...prevState,
                    city_id: '',
                    barangay_id: '',
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
                const currentBarangay = barangays.find(barangay => barangay.iid === residentData.barangay_id);
                setSelectedBarangay(currentBarangay.iid);
                setFormData((prevState) => ({
                    ...prevState,
                    barangay_id: currentBarangay.iid,
                }));
            } else {
                setSelectedBarangay('');
                setFormData((prevState) => ({
                    ...prevState,
                    barangay_id: '',
                }));
            }
        } catch (error) {
            console.error("Error fetching all Barangays:", error);
        }
    };
    const fetchAllPurok = async () => {
        try {
            if (!selectedBarangay) {
                setAllPuroks([]);
                return;
            }

            const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/location/purok/${selectedBarangay}`, { withCredentials: true });
            const puroks = response.data;
            setAllPuroks(puroks);

            // Add a default "Select Purok" option
            if (puroks.length > 0) {
                // Only set the current purok if it exists in the new list of puroks
                const currentPurok = puroks.find(purok => purok.iid === residentData.purok_id);
                if (currentPurok) {
                    setSelectedPurok(currentPurok.iid);
                    setFormData(prevState => ({
                        ...prevState,
                        purok_id: currentPurok.iid,
                    }));
                } else {
                    // If the current purok is not in the new list, reset the selection
                    setSelectedPurok('');
                    setFormData(prevState => ({
                        ...prevState,
                        purok_id: '',
                    }));
                }
            } else {
                setSelectedPurok('');
                setFormData(prevState => ({
                    ...prevState,
                    purok_id: '',
                }));
            }
        } catch (error) {
            console.error("Error fetching all Puroks:", error);
            setAllPuroks([]);
            setSelectedPurok('');
        }
    };

    const handleRegionChange = (e) => {
        const regionId = e.target.value;
        setSelectedRegion(regionId);
        setFormData(prevState => ({
            ...prevState,
            region_id: regionId,
            province_id: '',
            city_id: '',
            barangay_id: '',
            purok_id: ''
        }));
    };

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setFormData(prevState => ({
            ...prevState,
            province_id: provinceId,
            city_id: '',
            barangay_id: '',
            purok_id: ''
        }));
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        setFormData(prevState => ({
            ...prevState,
            city_id: cityId,
            barangay_id: '',
            purok_id: ''
        }));
    };

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        setSelectedBarangay(barangayId);
        setFormData(prevState => ({
            ...prevState,
            barangay_id: barangayId,
            purok_id: ''
        }));
    };

    const handlePurokChange = (e) => {
        const purokId = e.target.value;
        setSelectedPurok(purokId);
        setFormData(prevState => ({
            ...prevState,
            purok_id: purokId
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file ? file.name : "");
            // Create preview URL
            const previewURL = URL.createObjectURL(file);
            setImagePreview(previewURL);
            setFormData(prevData => ({
                ...prevData,
                profile_image: file
            }));
        }
    };

    const handleOptionRemove = () => {
        setFileName(""); // Reset the file name
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
            is_household_head: e.target.value === 'yes' ? 1 : 0,
        }));
    };

    const handleIsRegisteredVoter = (e) => {
        setFormData(prevData => ({
            ...prevData,
            is_registered_voter: e.target.value === 'yes' ? 1 : 0,
        }));
    };

    const handleIsLocalResident = (e) => {
        setFormData(prevData => ({
            ...prevData,
            is_local_resident: e.target.value === 'yes' ? 1 : 0,
        }));
    }

    const handleIsJuanBataanMember = (e) => {
        setFormData(prevData => ({
            ...prevData,
            is_juan_bataan_member: e.target.value === 'yes' ? 1 : 0
        }));
    };

    const handleIsSoloParent = (e) => {
        setFormData(prevData => ({
            ...prevData,
            is_solo_parent: e.target.value === 'yes' ? 1 : 0,
        }));
    };

    const handleIsPWD = (e) => {
        setFormData(prevData => ({
            ...prevData,
            is_pwd: e.target.value === 'yes' ? 1 : 0,
        }));
    };

    const handleCancel = () => {
        navigate('/resident-management');
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            const formDataWithImage = new FormData();

            if (selectedFile) {
                formDataWithImage.append('Profile_Image', selectedFile);
            } else if (formData.profile_image) {
                formDataWithImage.append('Profile_Image', formData.profile_image); // Send the previous image path
            }

            // Append other fields from formData
            Object.keys(formData).forEach((key) => {
                if (key !== 'profile_image') { // Skip the profile_image key to avoid redundancy
                    formDataWithImage.append(key, formData[key] || ''); // Handle empty fields
                }
            });

            // Log the FormData for debugging
            console.log('Form Data With Image:', formDataWithImage);
            console.log('Form Data:', formData);

            // Send the PUT request with FormData containing the image and other form fields
            const response = await axios.put(
                `http://${cfg.domainname}:${cfg.serverport}/residents/update/${formData.ResidentID}`,
                formDataWithImage,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                sessionStorage.setItem('residentEditSuccess', 'true');
                // Update the profile_image with the response from the server if it was updated
                setFormData({
                    ...formData,
                    profile_image: response.data.profile_image || formData.profile_image, // Update profile_image if necessary
                });
                navigate('/resident-management', { state: { residentData: response.data } }); // Redirect after successful update
            } else {
                setErrorMessage('Failed to update resident.');
            }
        } catch (error) {
            console.error('Error during update:', error);
            setErrorMessage('Failed to update resident.');
        } finally {
            setLoading(false);
        }
    };



    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setErrorMessage('');
    //     setLoading(true);

    //     try {
    //         const response = await axios.put(`http://${cfg.domainname}:${cfg.serverport}/residents/update/${formData.ResidentID}`, formData, { withCredentials: true });

    //         if (response.status === 200) {
    //             sessionStorage.setItem('residentEditSuccess', 'true');
    //             navigate('/resident-management');
    //         } else {
    //             setErrorMessage('Failed to update resident. Response status: ' + response.status);
    //         }
    //     } catch (error) {
    //         console.error('Error during update:', error);

    //         if (error.response) {
    //             setErrorMessage(`Failed to update resident. ${error.response.data.message || 'Unknown server error'}`);
    //         } else if (error.request) {
    //             setErrorMessage('Failed to update resident. No response from the server.');
    //         } else {
    //             setErrorMessage(`Failed to update resident. Error: ${error.message}`);
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
                                <h1 className="text-xl font-semibold text-gray-500">Update Resident</h1>
                                <p className="text-sm text-gray-400 mt-2">Fill out the form below to update resident to the system.</p>
                            </div>
                            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Personal Details Section */}
                                <div className="col-span-1 md:col-span-3 mb-4">
                                    <div className='flex items-center gap-3 mb-4'>
                                        <BsFillPersonVcardFill className='w-6 h-6 text-gray-400' />
                                        <h2 className="text-sm font-bold text-gray-500">Personal Details</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">First Name</label>
                                            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Last Name</label>
                                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className='flex gap-4'>
                                            <div className='flex-2'>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">Middle Name</label>
                                                <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="Middle Name" className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div className='flex-1'>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">Suffix</label>
                                                <select
                                                    name="suffix"
                                                    value={formData.suffix || ''}
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
                                            <input type="text" name="birth_place" value={formData.birth_place} onChange={handleChange} className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Occupation</label>
                                            <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Programmer" className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">
                                                Civil Status
                                            </label>
                                            <select name="civil_status" value={formData.civil_status} onChange={handleChange} className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                                                name="gender"
                                                value={formData.gender || ''}
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
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, profile_image: e.target.files[0] })
                                                    }
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
                                                name='region_id'
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
                                                name='province_id'
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
                                                name='city_id'
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
                                                name='barangay_id'
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
                                                name='purok_id'
                                                onChange={handlePurokChange}
                                                disabled={!selectedBarangay}
                                                className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Purok</option>
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
                                            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder='House No.' required className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">
                                                Resident Type
                                            </label>
                                            <select name="resident_type" value={formData.resident_type} onChange={handleChange} className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                                                        name="is_local_resident"
                                                        value="yes"
                                                        checked={formData.is_local_resident === 1}
                                                        onChange={handleIsLocalResident}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="is_local_resident"
                                                        value="no"
                                                        checked={formData.is_local_resident === 0}
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
                                            <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder='09134567894' required className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Email</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder='JohnDoe@email.com' className="border border-gray-300 p-2 w-full text-sm rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                                                        name="is_household_head"
                                                        value="yes"
                                                        checked={formData.is_household_head === 1}
                                                        onChange={handleIsHouseholdHead}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="is_household_head"
                                                        value="no"
                                                        checked={formData.is_household_head === 0}
                                                        onChange={handleIsHouseholdHead}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Household ID</label>
                                            <input type="text" name="household_id" value={formData.household_id} onChange={handleChange} placeholder='12345' className="border text-sm text-gray-500 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                                                        name="is_registered_voter"
                                                        value="yes"
                                                        checked={formData.is_registered_voter === 1}
                                                        onChange={handleIsRegisteredVoter}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="is_registered_voter"
                                                        value="no"
                                                        checked={formData.is_registered_voter === 0}
                                                        onChange={handleIsRegisteredVoter}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Voter ID</label>
                                            <input type="text" name="voter_id_number" value={formData.voter_id_number} onChange={handleChange} placeholder='12345' className="border text-sm text-gray-500 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                                                        name="is_juan_bataan_member"
                                                        value="yes"
                                                        checked={formData.is_juan_bataan_member === 1}
                                                        onChange={handleIsJuanBataanMember}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="is_juan_bataan_member"
                                                        value="no"
                                                        checked={formData.is_juan_bataan_member === 0}
                                                        onChange={handleIsJuanBataanMember}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">One Bataan ID</label>
                                            <input type="text" name="juan_bataan_id" value={formData.juan_bataan_id} onChange={handleChange} placeholder='12345' className="border text-sm text-gray-500 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 mb-4 gap-6">
                                        <div>
                                            <div className='leading-3 mb-4'>
                                                <label className="block text-sm font-medium text-gray-500">Are you a Solo Parent?</label>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="is_solo_parent"
                                                        value="yes"
                                                        checked={formData.is_solo_parent === 1}
                                                        onChange={handleIsSoloParent}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="is_solo_parent"
                                                        value="no"
                                                        checked={formData.is_solo_parent === 0}
                                                        onChange={handleIsSoloParent}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">Solo Parent ID</label>
                                            <input
                                                type="text"
                                                name="solo_parent_id"
                                                value={formData.solo_parent_id}
                                                onChange={handleChange}
                                                placeholder='12345'
                                                className="border text-sm text-gray-500 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 mb-4 gap-6">
                                        <div>
                                            <div className='leading-3 mb-4'>
                                                <label className="block text-sm font-medium text-gray-500">Are you a PWD?</label>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="is_pwd"
                                                        value="yes"
                                                        checked={formData.is_pwd === 1}
                                                        onChange={handleIsPWD}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="is_pwd"
                                                        value="no"
                                                        checked={formData.is_pwd === 0}
                                                        onChange={handleIsPWD}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-500">PWD ID</label>
                                            <input
                                                type="text"
                                                name="pwd_id"
                                                value={formData.pwd_id}
                                                onChange={handleChange}
                                                placeholder='12345'
                                                className="border text-sm text-gray-500 border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-3 flex justify-end mt-4 space-x-4">
                                    <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400">Cancel</button>
                                    <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300">{loading ? 'Saving...' : 'Update Resident'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditResidentPage;
