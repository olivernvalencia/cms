import { IoSearch } from "react-icons/io5";
import SearchModal from '../components/SearchModal';

export default function renderAdditionalFields({
    selectedCertificateType,
    formData,
    handleInputChange,
    isComplainantModalOpen,
    isApplicantModalOpen,
    isSelectMotherModalOpen,
    isSelectFatherModalOpen,
    setIsComplainantModalOpen,
    setIsApplicantModalOpen,
    setIsSelectMotherModalOpen,
    setIsSelectFatherModalOpen,
    handleSelectComplainant,
    handleSelectApplicant,
    handleSelectMother,
    handleSelectFather,
    setIsIssuedToModalOpen,
    isIssuedToModalOpen,
    handleIssuedTo,
    handlePartnerName,
    isPartnerNameModalOpen,
    setIsPartnerNameModalOpen,
}) {
    if (!selectedCertificateType) return null;

    // const certificateName = selectedCertificateType.iname.toLowerCase();
    const certificateName = selectedCertificateType.iid;

    switch (certificateName) {
        case 3: //'business closure certification':
        case 2: //'business permit certification':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Business Name<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="businessName"
                            placeholder="Enter Business Name"
                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                            value={formData.businessName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Business Address<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="businessAddress"
                            placeholder="Enter Business Address"
                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                            value={formData.businessAddress}
                            onChange={handleInputChange}
                        />
                    </div>
                    {certificateName === 'business closure certification' && (
                        <div className='flex-1'>
                            <label className="block mb-2 text-sm font-medium text-gray-500">
                                Effectivity Date<span className="text-red-600">*</span>
                            </label>
                            <input
                                type="date"
                                name="closureDate"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.closureDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}

                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="complainantName"
                                placeholder="Type or Search Complainant Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.complainantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsComplainantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isComplainantModalOpen}
                                onClose={() => setIsComplainantModalOpen(false)}
                                onSelect={handleSelectComplainant}
                            />
                        </div>
                    </div>
                </div>
            );
        case 5: //'death certification':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="complainantName"
                                placeholder="Type or Search resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.complainantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsComplainantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isComplainantModalOpen}
                                onClose={() => setIsComplainantModalOpen(false)}
                                onSelect={handleSelectComplainant}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Middle Name<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="complainantMiddleName"
                            placeholder="Type Middle Name"
                            className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.complainantMiddleName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Age<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="complainantAge"
                            placeholder="Type Age"
                            className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.complainantAge}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Date of Death<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="date"
                            name="dateOfDeath"
                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                            value={formData.dateOfDeath}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Place of Death<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="placeOfDeath"
                            placeholder="Enter Place of Death"
                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                            value={formData.placeOfDeath}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Applicant Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="applicantName"
                                placeholder="Type or Search resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.applicantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsApplicantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isApplicantModalOpen}
                                onClose={() => setIsApplicantModalOpen(false)}
                                onSelect={handleSelectApplicant}
                            />
                        </div>
                    </div>
                </div>
            );
        case 9: //'relationship certification':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="complainantName"
                                placeholder="Type or Search resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.complainantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsComplainantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isComplainantModalOpen}
                                onClose={() => setIsComplainantModalOpen(false)}
                                onSelect={handleSelectComplainant}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Partner Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="partnerName"
                                placeholder="Type or Search Complainant Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.partnerName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsPartnerNameModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isPartnerNameModalOpen}
                                onClose={() => setIsPartnerNameModalOpen(false)}
                                onSelect={handlePartnerName}
                            />
                        </div>
                    </div>
                </div>
            );
        case 8: //'residence certification':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="complainantName"
                                placeholder="Type or Search resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.complainantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsComplainantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isComplainantModalOpen}
                                onClose={() => setIsComplainantModalOpen(false)}
                                onSelect={handleSelectComplainant}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Mother's Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="motherName"
                                placeholder="Type or Search Mother's Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.motherName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsSelectMotherModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Mother"
                                isOpen={isSelectMotherModalOpen}
                                onClose={() => setIsSelectMotherModalOpen(false)}
                                onSelect={handleSelectMother}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Father's Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="motherName"
                                placeholder="Type or Search Mother's Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.fatherName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsSelectFatherModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Father"
                                isOpen={isSelectFatherModalOpen}
                                onClose={() => setIsSelectFatherModalOpen(false)}
                                onSelect={handleSelectFather}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Issued For<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="issuedTo"
                                placeholder="Type or Search Mother's Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.issuedTo}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsIssuedToModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Father"
                                isOpen={isIssuedToModalOpen}
                                onClose={() => setIsIssuedToModalOpen(false)}
                                onSelect={handleIssuedTo}
                            />
                        </div>
                    </div>
                </div>
            );
        case 12: //'psa certification':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="complainantName"
                                placeholder="Type or Search resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.complainantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsComplainantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isComplainantModalOpen}
                                onClose={() => setIsComplainantModalOpen(false)}
                                onSelect={handleSelectComplainant}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Mother's Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="motherName"
                                placeholder="Type or Search Mother's Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.motherName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsSelectMotherModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Mother"
                                isOpen={isSelectMotherModalOpen}
                                onClose={() => setIsSelectMotherModalOpen(false)}
                                onSelect={handleSelectMother}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Father's Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="motherName"
                                placeholder="Type or Search Mother's Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.fatherName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsSelectFatherModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Father"
                                isOpen={isSelectFatherModalOpen}
                                onClose={() => setIsSelectFatherModalOpen(false)}
                                onSelect={handleSelectFather}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Issued For<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="issuedTo"
                                placeholder="Type or Search Mother's Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.issuedTo}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsIssuedToModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Father"
                                isOpen={isIssuedToModalOpen}
                                onClose={() => setIsIssuedToModalOpen(false)}
                                onSelect={handleIssuedTo}
                            />
                        </div>
                    </div>
                </div>
            );
        case 7: //'lot certification':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="complainantName"
                                placeholder="Type or Search resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.complainantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsComplainantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isComplainantModalOpen}
                                onClose={() => setIsComplainantModalOpen(false)}
                                onSelect={handleSelectComplainant}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Lot Size<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="lotSize"
                            placeholder="Enter Lot Location"
                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                            value={formData.lotSize}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Purpose<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="purpose"
                            placeholder="Purpose"
                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                            value={formData.purpose}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            );
        case 15: //'electrical permit':
            return (
                <div className='flex-1'>
                    <label className="block mb-2 text-sm font-medium text-gray-500">
                        Permit Type<span className="text-red-600">*</span>
                    </label>
                    <select
                        name="permitType"
                        className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                        value={formData.permitType}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Permit Type</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                    </select>
                </div>
            );
        case 11: //'solo parent certification':
            return (
                <div className='flex-1'>
                    <label className="block mb-2 text-sm font-medium text-gray-500">
                        Solo Parent Type<span className="text-red-600">*</span>
                    </label>
                    <select
                        name="solo_parent_type"
                        className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                        value={formData.solo_parent_type}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Solo Parent Type</option>
                        <option value="single_parent">Single Parent</option>
                        <option value="widowed">Widowed</option>
                        <option value="separated">Separated</option>
                        <option value="solo_by_choice">Solo by Choice</option>
                    </select>
                </div>
            );
        case 4: //'calamity certification':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="complainantName"
                                placeholder="Type or Search resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.complainantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsComplainantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isComplainantModalOpen}
                                onClose={() => setIsComplainantModalOpen(false)}
                                onSelect={handleSelectComplainant}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Middle Name<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="complainantMiddleName"
                            placeholder="Type Middle Name"
                            className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.complainantMiddleName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Address<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="complainantAddress"
                            placeholder="Type Address"
                            className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.complainantAddress}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Calamity Name<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="calamityName"
                            placeholder="Type Age"
                            className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.calamityName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Start Date<span className="text-red-600">*</span>
                        </label>
                        <input
                            type='date'
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            End Date<span className="text-red-600">*</span>
                        </label>
                        <input
                            type='date'
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            );
        case 17: //'barangay clearance':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="complainantName"
                                placeholder="Type or Search resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.complainantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsComplainantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isComplainantModalOpen}
                                onClose={() => setIsComplainantModalOpen(false)}
                                onSelect={handleSelectComplainant}
                            />
                        </div>
                    </div>
                </div>
            );
        case 13: //'unemployment certification':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="complainantName"
                                placeholder="Type or Search Complainant Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.complainantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsComplainantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isComplainantModalOpen}
                                onClose={() => setIsComplainantModalOpen(false)}
                                onSelect={handleSelectComplainant}
                            />
                        </div>
                    </div>
                </div>
            );
        case 1: //'assistance certification':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="complainantName"
                                placeholder="Type or Search resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.complainantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsComplainantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Resident"
                                isOpen={isComplainantModalOpen}
                                onClose={() => setIsComplainantModalOpen(false)}
                                onSelect={handleSelectComplainant}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Calamity Name<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="calamityName"
                            placeholder="Type Age"
                            className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.calamityName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Calamity Date<span className="text-red-600">*</span>
                        </label>
                        <input
                            type='date'
                            name="calamityDate"
                            value={formData.calamityDate}
                            onChange={handleInputChange}
                            className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            );
        case 6: //'indigency certification':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="complainantName"
                                placeholder="Type or Search resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.complainantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsComplainantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isComplainantModalOpen}
                                onClose={() => setIsComplainantModalOpen(false)}
                                onSelect={handleSelectComplainant}
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Middle Name<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="complainantMiddleName"
                            placeholder="Type Middle Name"
                            className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.complainantMiddleName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Civil Status<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="complainantAge"
                            placeholder="Type Age"
                            className="border text-sm border-gray-300 p-2 w-full text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.civilStatus}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Issued For<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="applicantName"
                                placeholder="Type or Search resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.applicantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsApplicantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isApplicantModalOpen}
                                onClose={() => setIsApplicantModalOpen(false)}
                                onSelect={handleSelectApplicant}
                            />
                        </div>
                    </div>
                </div>
            );
        default:
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className='flex-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Name<span className="text-red-600">*</span>
                        </label>
                        <div className="relative rounded-md">
                            <input
                                type="text"
                                name="complainantName"
                                placeholder="Type or Search resident Name"
                                className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                                value={formData.complainantName}
                                onChange={handleInputChange}
                            />
                            <div
                                className="h-full w-9 absolute flex items-center justify-center right-0 top-0 bg-blue-600 cursor-pointer rounded-r-md"
                                onClick={() => setIsComplainantModalOpen((prev) => !prev)}
                            >
                                <IoSearch className="w-5 h-5 text-white" />
                            </div>
                            <SearchModal
                                title="Select Complainant"
                                isOpen={isComplainantModalOpen}
                                onClose={() => setIsComplainantModalOpen(false)}
                                onSelect={handleSelectComplainant}
                            />
                        </div>
                    </div>
                </div>
        )
    }
};

