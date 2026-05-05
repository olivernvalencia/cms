import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cfg from '../../../server/config/domain.js';
import { useAuth } from "../components/AuthContext.jsx";
import SearchModal from '../components/SearchModal.jsx'
import SearchModalDynamic from '../components/SearchModalDynamic.jsx'
import { IoSearch } from "react-icons/io5";
import { RxAvatar } from 'react-icons/rx';

const UserManagementModal = ({ isOpen, onClose, onSubmit, barangayId }) => {
    const [formData, setFormData] = useState({
        barangay_id: barangayId,
        city_id: "",
        province_id: "",
        user: "",
        password: "",
        role_id: "",
        lgu_type_id: "",
        resident_id: "",
        resident_name: "",
        fullname: "",
    });

    const [allRegion, setAllRegion] = useState([]);
    const [allProvinces, setAllProvinces] = useState([]);
    const [allCities, setAllCities] = useState([]);
    const [allBarangay, setAllBarangay] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');
    const [userRoles, setUserRoles] = useState([]);
    const [lguTypes, setLguTypes] = useState([]);
    const [selectedLguTypeId, setSelectedLguTypeId] = useState(null);
    const [selectResidentModal, setSelectResidentModal] = useState(false);
    const [residentId, setResidentId] = useState(null);
    const [residentName, setResidentName] = useState("");
    const [residentAddress, setResidentAddress] = useState("");
    const [residentContact, setResidentContact] = useState("");
    const [selectedUserBarangayId, setSelectedUserBarangayId] = useState(null);
    const [error, setError] = useState("");

    const { roleId, barangayId: authBarangayId, cityId: authCityId, provinceId: authProvinceId, regionId: authRegionId } = useAuth();
    const isCbsAdmin = Number(roleId) === 1;

    useEffect(() => {
        if (isOpen) {
            fetchAllRegion();
            fetchAllLguTypes();
        }
    }, [isOpen]);

    // Auto-fill location for non-cbsadmin when modal opens
    useEffect(() => {
    if (isOpen && !isCbsAdmin && authRegionId) {
        const autoFill = async () => {
            // Set region first
            setSelectedRegion(authRegionId);
            setFormData(prev => ({ ...prev, region_id: authRegionId }));

            // Fetch provinces for that region
            try {
                const provRes = await axios.get(
                    `http://${cfg.domainname}:${cfg.serverport}/location/provinces/${authRegionId}`,
                    { withCredentials: true }
                );
                setAllProvinces(provRes.data || []);
                setSelectedProvince(authProvinceId);
                setFormData(prev => ({ ...prev, province_id: authProvinceId }));
            } catch (e) { console.error(e); }

            // Fetch cities for that province
            try {
                const cityRes = await axios.get(
                    `http://${cfg.domainname}:${cfg.serverport}/location/cities/${authProvinceId}`,
                    { withCredentials: true }
                );
                setAllCities(cityRes.data || []);
                setSelectedCity(authCityId);
                setFormData(prev => ({ ...prev, city_id: authCityId }));
            } catch (e) { console.error(e); }

            // Fetch barangays for that city
            try {
                const brgyRes = await axios.get(
                    `http://${cfg.domainname}:${cfg.serverport}/location/barangay/${authCityId}`,
                    { withCredentials: true }
                );
                setAllBarangay(brgyRes.data || []);
                setSelectedBarangay(authBarangayId);
                setSelectedUserBarangayId(authBarangayId);
                setFormData(prev => ({ ...prev, barangay_id: authBarangayId }));
            } catch (e) { console.error(e); }
        };

        autoFill();
        }
    }, [isOpen, isCbsAdmin, authRegionId, authProvinceId, authCityId, authBarangayId]);

    useEffect(() => {
        if (selectedRegion) {
            fetchAllProvince();
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedProvince) {
            fetchAllCity();
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedCity) {
            fetchAllBarangay();
        }
    }, [selectedCity]);

    useEffect(() => {
        if (formData.lgu_type_id) {
            fetchUserRolesByLguType(formData.lgu_type_id);
        }
    }, [formData.lgu_type_id]);

    const fetchAllRegion = async () => {
        try {
            const response = await axios.get(
                `http://${cfg.domainname}:${cfg.serverport}/location/region`,
                { withCredentials: true }
            );
            setAllRegion(response.data || []);
        } catch (error) {
            console.error("Error fetching regions:", error);
            setAllRegion([]);
        }
    };

    const fetchAllProvince = async () => {
        try {
            const response = await axios.get(
                `http://${cfg.domainname}:${cfg.serverport}/location/provinces/${selectedRegion}`,
                { withCredentials: true }
            );
            setAllProvinces(response.data || []);
        } catch (error) {
            console.error("Error fetching provinces:", error);
            setAllProvinces([]);
        }
    };

    const fetchAllCity = async () => {
        try {
            const response = await axios.get(
                `http://${cfg.domainname}:${cfg.serverport}/location/cities/${selectedProvince}`,
                { withCredentials: true }
            );
            setAllCities(response.data || []);
        } catch (error) {
            console.error("Error fetching cities:", error);
            setAllCities([]);
        }
    };

    const fetchAllBarangay = async () => {
        try {
            const response = await axios.get(
                `http://${cfg.domainname}:${cfg.serverport}/location/barangay/${selectedCity}`,
                { withCredentials: true }
            );
            setAllBarangay(response.data || []);
        } catch (error) {
            console.error("Error fetching barangays:", error);
            setAllBarangay([]);
        }
    };

    const fetchAllLguTypes = async () => {
        try {
            const response = await axios.get(
                `http://${cfg.domainname}:${cfg.serverport}/user/lgu-type`,
                { withCredentials: true }
            );
            setLguTypes(response.data?.data || []);
        } catch (error) {
            console.error("Error fetching LGU types:", error);
            setLguTypes([]);
        }
    };

    const fetchUserRolesByLguType = async (lguTypeId) => {
        try {
            const response = await axios.get(
                `http://${cfg.domainname}:${cfg.serverport}/user/get-user-role/${lguTypeId}`,
                { withCredentials: true }
            );
            setUserRoles(response.data?.data || []);
            setFormData(prev => ({ ...prev, role_id: "" }));
        } catch (error) {
            console.error("Error fetching user roles:", error);
            setUserRoles([]);
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
            barangay_id: ''
        }));
        setSelectedProvince('');
        setSelectedCity('');
        setSelectedBarangay('');
    };

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setFormData(prevState => ({
            ...prevState,
            province_id: provinceId,
            city_id: '',
            barangay_id: ''
        }));
        setSelectedCity('');
        setSelectedBarangay('');
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        setFormData(prevState => ({
            ...prevState,
            city_id: cityId,
            barangay_id: ''
        }));
        setSelectedBarangay('');
    };

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        setSelectedBarangay(barangayId);
        setFormData(prevState => ({
            ...prevState,
            barangay_id: barangayId
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'lgu_type_id') {
            fetchUserRolesByLguType(value);
        }
    };

    const handleSelectResident = (resident) => {
        setResidentId(resident.resident_id);
        setResidentName(`${resident.first_name} ${resident.last_name}`);
        setResidentAddress(`${resident.address || ""} ${resident.purok}, ${resident.barangay}`);
        setResidentContact(resident.contact_number || "");
        setSelectResidentModal(false);
        setSelectedUserBarangayId(resident.barangay_id);

        const fullName = `${resident.first_name} ${resident.last_name}`;
        setFormData(prev => ({
            ...prev,
            resident_id: resident.resident_id,
            resident_name: fullName
        }));
    };

    const handleCloseReporterModal = () => {
        setSelectResidentModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            barangay_id: selectedUserBarangayId,
            city_id: formData.city_id,
            province_id: formData.province_id,
            user: formData.user,
            password: formData.password,
            role_id: formData.role_id,
            lgu_type_id: formData.lgu_type_id,
            resident_id: formData.resident_id,
            fullname: residentName,
        };

        try {
            const response = await axios.post(
                `http://${cfg.domainname}:${cfg.serverport}/user/add-user`,
                payload,
                { withCredentials: true }
            );
            if (response.status === 201) {
                onSubmit();
                console.log("User Added Successfully");
            }
        } catch (error) {
            console.error("Error adding user:", error);
            setError("Failed to add user. Please try again.");
        }
    };

    // Determine the fetchUrl for resident search
    const residentFetchUrl = isCbsAdmin
        ? `http://${cfg.domainname}:${cfg.serverport}/residents/${selectedBarangay}`
        : `http://${cfg.domainname}:${cfg.serverport}/residents/${authBarangayId}`;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                <div className='leading-3 mb-6'>
                    <h2 className="text-lg font-bold text-gray-500">Add New User</h2>
                    <p className="text-xs text-gray-400">Fill in the form below to create a new user account with appropriate details.</p>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Location fields - only show for cbsadmin */}
                        {isCbsAdmin && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className='flex-1'>
                                        <label className="block mb-2 text-sm font-medium text-gray-500">
                                            Region<span className="text-red-600">*</span>
                                        </label>
                                        <select
                                            value={selectedRegion}
                                            onChange={handleRegionChange}
                                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select Region</option>
                                            {allRegion.map(region => (
                                                <option key={region.iid} value={region.iid}>
                                                    {region.iname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='flex-1'>
                                        <label className="block mb-2 text-sm font-medium text-gray-500">
                                            Province<span className="text-red-600">*</span>
                                        </label>
                                        <select
                                            value={selectedProvince}
                                            onChange={handleProvinceChange}
                                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                            disabled={!selectedRegion}
                                            required
                                        >
                                            <option value="">Select Province</option>
                                            {allProvinces.map(province => (
                                                <option key={province.iid} value={province.iid}>
                                                    {province.iname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className='flex-1'>
                                        <label className="block mb-2 text-sm font-medium text-gray-500">
                                            City<span className="text-red-600">*</span>
                                        </label>
                                        <select
                                            value={selectedCity}
                                            onChange={handleCityChange}
                                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                            disabled={!selectedProvince}
                                            required
                                        >
                                            <option value="">Select City</option>
                                            {allCities.map(city => (
                                                <option key={city.iid} value={city.iid}>
                                                    {city.iname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='flex-1'>
                                        <label className="block mb-2 text-sm font-medium text-gray-500">
                                            Barangay<span className="text-red-600">*</span>
                                        </label>
                                        <select
                                            value={selectedBarangay}
                                            onChange={handleBarangayChange}
                                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                            disabled={!selectedCity}
                                            required
                                        >
                                            <option value="">Select Barangay</option>
                                            {allBarangay.map(barangay => (
                                                <option key={barangay.iid} value={barangay.iid}>
                                                    {barangay.iname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                    Resident<span className="text-red-600">*</span>
                                </label>
                                <div className="relative rounded-md">
                                    <input
                                        type="text"
                                        name="resident_name"
                                        placeholder="Select Resident"
                                        className="text-sm border h-full border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                        value={formData.resident_name}
                                        onChange={handleInputChange}
                                    />
                                    <div
                                        className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                        onClick={() => setSelectResidentModal(true)}
                                    >
                                        <IoSearch className="w-5 h-5 text-white" />
                                    </div>

                                    <SearchModalDynamic
                                        isOpen={selectResidentModal}
                                        title="Select a Resident"
                                        onClose={() => handleCloseReporterModal()}
                                        onSelect={(resident) => handleSelectResident(resident)}
                                        options={{
                                            fetchUrl: residentFetchUrl,
                                            filterFunction: (user, searchTerm) =>
                                                `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
                                            renderItem: (user) => (
                                                <>
                                                    <RxAvatar className="w-10 h-10 text-gray-400" />
                                                    <div className="ml-4">
                                                        <h3 className="font-bold text-gray-800">{`${user.first_name} ${user.last_name}`}</h3>
                                                    </div>
                                                </>
                                            )
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                    Username<span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="user"
                                    placeholder="Username"
                                    value={formData.user}
                                    onChange={handleInputChange}
                                    className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                    Password<span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                    LGU Type<span className="text-red-600">*</span>
                                </label>
                                <select
                                    name="lgu_type_id"
                                    value={formData.lgu_type_id}
                                    onChange={handleInputChange}
                                    className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select LGU Type</option>
                                    {lguTypes.map(lguType => (
                                        <option key={lguType.iid} value={lguType.iid}>
                                            {lguType.iname}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-500">
                                    Role<span className="text-red-600">*</span>
                                </label>
                                <select
                                    name="role_id"
                                    value={formData.role_id}
                                    onChange={handleInputChange}
                                    className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                    disabled={!formData.lgu_type_id}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {userRoles.map(role => (
                                        <option key={role.iid} value={role.iid}>
                                            {role.iname}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserManagementModal;