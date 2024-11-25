import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JuanBataanLogo from '../assets/juanbataan.png';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import { BsFillPersonVcardFill } from "react-icons/bs";
import { MdContactPhone } from "react-icons/md";
import { FaHouseUser } from "react-icons/fa6";
import { IoIosFingerPrint } from "react-icons/io";

const EditResidentPage = ({ }) => {
    const [formData, setFormData] = useState({
        ResidentID: '',
        FirstName: '',
        LastName: '',
        MiddleName: '',
        Age: '',
        birthday: '',
        Gender: '',
        Address: '',
        ContactNumber: '',
        Email: '',
        CivilStatus: '',
        Occupation: '',
        HouseholdID: '',
        JuanBataanID: '',
        RegistrationDate: '',
        Status: '',
        RegisteredVoter: false,
        VoterIDNumber: '',
        VotingPrecinct: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { residentData } = location.state || {};
    const navigate = useNavigate();
    const [options, setoptions] = useState([]);
    const [ProvinceID, setProvinceID] = useState(10);
    const [Cityoptions, setCityoptions] = useState([]);
    const [CityID, setCityID] = useState(2269);
    const [Barangayoptions, setBarangayoptions] = useState([]);
    const [BarangayID, setBarangayID] = useState(5628);

    useEffect(() => {
        if (residentData) {
            setFormData({
                ...residentData,
                birthday: formatDate(residentData.birthday),
                RegistrationDate: formatDate(residentData.RegistrationDate),
            });
        }
    }, [residentData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            RegisteredVoter: e.target.checked,
        }));
    };

    const handleCancel = () => {
        navigate('/resident-management');
    }


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        formData["ProvinceID"] = ProvinceID
        formData["CityID"] = CityID
        formData["BarangayID"] = BarangayID
        
        try {
            const response = await axios.put(`http://localhost:8080/update-resident/${formData.ResidentID}`, formData, { withCredentials: true });

            if (response.status === 200) {
                sessionStorage.setItem('residentEditSuccess', 'true');
                navigate('/resident-management');
            } else {
                setErrorMessage('Failed to update resident. Response status: ' + response.status);
            }
        } catch (error) {
            console.error('Error during update:', error);

            if (error.response) {
                setErrorMessage(`Failed to update resident. ${error.response.data.message || 'Unknown server error'}`);
            } else if (error.request) {
                setErrorMessage('Failed to update resident. No response from the server.');
            } else {
                setErrorMessage(`Failed to update resident. Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch data from the API
        axios.get('http://localhost:8080/get-provinces', { withCredentials: true })
        .then(response => {
            setoptions(response.data);
        })
        .catch(error => {
        console.error('There was an error fetching the data!', error);
        });
        });
        
    const ProvincehandleChange = (event) => {
            setProvinceID(event.target.value);
        };

    useEffect(() => {
        // Fetch data from the API
        axios.post('http://localhost:8080/get-cities', {ProvinceID}, { withCredentials: true })
        .then(response => {
            setCityoptions(response.data);
        })
        .catch(error => {
        console.error('There was an error fetching the data!', error);
        });
        });

    const CityhandleChange = (event) => {
        setCityID(event.target.value);
        };

    useEffect(() => {
        // Fetch data from the API
        axios.post('http://localhost:8080/get-barangays', {CityID}, { withCredentials: true })
        .then(response => {
            setBarangayoptions(response.data);
        })
        .catch(error => {
        console.error('There was an error fetching the data!', error);
        });
        });
    
    const BarangayhandleChange = (event) => {
        setBarangayID(event.target.value);
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
                            <div className='leading-2 mb-6'>
                                <h2 className="text-xl font-semibold text-gray-500">Edit Resident</h2>
                                <p className="text-xs text-gray-400">
                                    Update the details of the selected resident below. Ensure all required fields are filled out accurately.
                                </p>
                            </div>
                            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                            {formData && (
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="col-span-1 md:col-span-3 mb-4">
                                        <div className='flex items-center gap-3 mb-4'>
                                            <BsFillPersonVcardFill className='w-6 h-6 text-gray-400' />
                                            <h2 className="text-sm font-bold text-gray-500">Personal Details</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">First Name</label>
                                                <input type="text" name="FirstName" value={formData.FirstName} onChange={handleChange} required className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">Last Name</label>
                                                <input type="text" name="LastName" value={formData.LastName} onChange={handleChange} required className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Middle Name
                                                </label>
                                                <input type="text" name="MiddleName" value={formData.MiddleName} onChange={handleChange} className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Age
                                                </label>
                                                <input type="number" name="Age" value={formData.Age} onChange={handleChange} required className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Birthday
                                                </label>
                                                <input
                                                    type="date"
                                                    name="birthday"
                                                    value={formData.birthday}
                                                    onChange={handleChange}
                                                    className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Gender
                                                </label>
                                                <select name="Gender" value={formData.Gender} onChange={handleChange} required className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option value="">Select Gender</option>
                                                    <option value="M">Male</option>
                                                    <option value="F">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Occupation
                                                </label>
                                                <input type="text" name="Occupation" value={formData.Occupation} onChange={handleChange} required className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-3 mb-4">
                                        <div className='flex items-center gap-3 mb-4'>
                                            <MdContactPhone className='w-6 h-6 text-gray-400' />
                                            <h2 className="text-sm font-bold text-gray-500">Contact Information</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Address
                                                </label>
                                                <input type="text" name="Address" value={formData.Address} onChange={handleChange} required className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Contact Number
                                                </label>
                                                <input type="text" name="ContactNumber" value={formData.ContactNumber} onChange={handleChange} required className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Email
                                                </label>
                                                <input type="email" name="Email" value={formData.Email} onChange={handleChange} className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div>
										        <label className="block mb-2 text-sm font-medium text-gray-500">Province</label>
                                                <select name="ProvinceID" value={ProvinceID} onChange={ProvincehandleChange} required className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option value="">Select Province</option>
                                                        {options.map(option => (
                                                    <option key={option.iid} value={option.iid}>
                                                        {option.iname}
                                                    </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
										        <label className="block mb-2 text-sm font-medium text-gray-500">City</label>
                                                <select name="CityID" value={CityID} onChange={CityhandleChange} required className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option value="">Select City</option>
                                                        {Cityoptions.map(option => (
                                                    <option key={option.iid} value={option.iid}>
                                                        {option.iname}
                                                    </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
										        <label className="block mb-2 text-sm font-medium text-gray-500">Barangay</label>
                                                <select name="BarangayID" value={BarangayID} onChange={BarangayhandleChange} required className="border text-sm border-gray-300 p-2 w-full rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option value="">Select Barangay</option>
                                                    {Barangayoptions.map(option => (
                                                        <option key={option.iid} value={option.iid}>
                                                            {option.iname}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-3 mb-4">
                                        <div className='flex items-center gap-3 mb-4'>
                                            <FaHouseUser className='w-6 h-6 text-gray-400' />
                                            <h2 className="text-sm font-bold text-gray-500">Household Information</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Household ID
                                                </label>
                                                <input type="text" name="HouseholdID" value={formData.HouseholdID} onChange={handleChange} required className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Juan Bataan ID
                                                </label>
                                                <div className='relative'>
                                                    <img src={JuanBataanLogo} alt="Juan Bataan Logo" className="w-5 h-5 absolute left-2 top-2" />
                                                    <input type="text" name="JuanBataanID" value={formData.JuanBataanID} onChange={handleChange} className="border p-2 pl-9  text-gray-500  text-sm w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Registration Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="RegistrationDate"
                                                    value={formData.RegistrationDate}
                                                    onChange={handleChange}
                                                    className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                                    Status
                                                </label>
                                                <select name="Status" value={formData.Status} onChange={handleChange} className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option value="">Select Status</option>
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-3 mb-4">
                                        <div className='flex items-center gap-3 mb-4'>
                                            <IoIosFingerPrint className='w-6 h-6 text-gray-400' />
                                            <h2 className="block text-sm font-bold text-gray-500">Voter Information</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className=" md:col-span-3 block mb-2 text-sm font-medium text-gray-500">
                                                    Registered Voter
                                                </label>
                                                <input type="checkbox" name="RegisteredVoter" checked={formData.RegisteredVoter} onChange={handleCheckboxChange} className="mr-2 focus:outline-blue-400 " />
                                            </div>
                                            {formData.RegisteredVoter ? (
                                                <>
                                                    <div>
                                                        <label className="block mb-2 text-sm font-medium text-gray-500 md:col-span-3">
                                                            Voter ID Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="VoterIDNumber"
                                                            value={formData.VoterIDNumber}
                                                            onChange={handleChange}
                                                            className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block mb-2 text-sm font-medium text-gray-500 md:col-span-3">
                                                            Voting Precinct
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="VotingPrecinct"
                                                            value={formData.VotingPrecinct}
                                                            onChange={handleChange}
                                                            className="border text-sm border-gray-300 text-gray-500 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-span-1 md:col-span-3 flex justify-end mt-4 space-x-4">
                                        <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400">Cancel</button>
                                        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                            {loading ? 'Updating...' : 'Update Resident'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div >
    );
};

export default EditResidentPage;
