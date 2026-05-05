import React, { useState, useRef, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';
import axios from 'axios';

import SearchDropdown from '../components/SearchDropdown';
import CertificatePreview from '../components/CertificatePreview';
import { useCertificationForm } from '../hooks/useCertificationForm';
import renderAdditionalFields from '../utils/certificateFieldRenderer.jsx';
import ReportPreview from './ReportPreview.jsx';
import { useNavigate } from "react-router-dom";
import cfg from '../../../server/config/domain.js';

const CertificationForm = () => {
    let {
        errorMessage,
        certificateTypes,
        CertificateTemplate,
        brgyOfficials,
        loading,
        selectedCertificateType,
        isComplainantModalOpen,
        isApplicantModalOpen,
        isSelectMotherModalOpen,
        isSelectFatherModalOpen,
        formData,
        setIsComplainantModalOpen,
        setIsApplicantModalOpen,
        setIsSelectMotherModalOpen,
        setIsSelectFatherModalOpen,
        handleCertificateTypeChange,
        handleInputChange,
        handleSelectComplainant,
        handleSelectApplicant,
        handleSelectMother,
        handleSelectFather,
        renderCertificateMessage,
        setIsIssuedToModalOpen,
        isIssuedToModalOpen,
        handleIssuedTo,
        handlePartnerName,
        isPartnerNameModalOpen,
        setIsPartnerNameModalOpen,
    } = useCertificationForm();

    const [customPurpose, setCustomPurpose] = useState('');
    const [showCustomPurpose, setShowCustomPurpose] = useState(false);
    const [overrideMessage, setOverrideMessage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerateButtonDisabled, setIsGenerateButtonDisabled] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [isMessageGenerated, setIsMessageGenerated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef(null);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];
    const [currentdate, setcurrentdate] = useState(today);
    const [controlNumber, setcontrolNumber] = useState('');
    const [indigentControlNumber, setindigentControlNumber] = useState('');

    useEffect(() => {
       const fetchControlNumber = async () => {
           try {
               const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/certificate/controlno`, {
               withCredentials: true 
               });
               if (response.status === 200) {
                   setcontrolNumber(response.data.control_number);
                   console.log("CTRL Data:" + response.data.control_number);
               }
           } catch (error) {
               console.error("Error fetching control number:", error);
           }
       };

      fetchControlNumber();
    }, []);

    const handleOpenPreviewInNewTab = async () => {
        if (!isMessageGenerated || !finalMessage) return;

        // Generate the PDF document as a blob
        const blob = await pdf(
            <CertificatePreview
                message={finalMessage}
                brgyOfficials={brgyOfficials}
                certificateTypeId={selectedCertificateType?.iid || '1'}
                certificateTitle={selectedCertificateType?.iname || ''}
                certificateTemplate={CertificateTemplate}
                applicant_image={formData.applicant_image}
                controlnumber={controlNumber}
                date={formData.issuanceDate
                    ? new Date(formData.issuanceDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                    : new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                }
            />
        ).toBlob();

        // Create a URL for the blob and open it in a new tab
        const blobUrl = URL.createObjectURL(blob);
        console.log(blobUrl);
        window.open(blobUrl, '_blank');
    };

    const handleGenerateTextContent = () => {
        if (renderCertificateMessage && renderCertificateMessage.length > 0) {
            setShowCustomPurpose(true);
            setIsGenerateButtonDisabled(true);
            setIsGenerating(true);

            const initialMessages = renderCertificateMessage;
            let currentText = '';
            let currentIndex = 0;

            const typeText = () => {
                if (currentIndex < initialMessages.length) {
                    const currentMessage = initialMessages[currentIndex];
                    const messageText = currentMessage.isBold
                        ? `<strong>${currentMessage.text}</strong>`
                        : currentMessage.text;

                    currentText += messageText + ' ';

                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = currentText;
                    setCustomPurpose(tempDiv.innerText);

                    currentIndex++;

                    const delay = 5000 / initialMessages.length;
                    setTimeout(typeText, delay);
                } else {
                    setIsGenerating(false);
                    setOverrideMessage(initialMessages);
                    setIsGenerateButtonDisabled(false);
                    setIsMessageGenerated(true); // Set this to true when generation is complete
                    setIsPreview(false); // Automatically show preview when generation is complete
                }
            };

            typeText();
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        if (!isMessageGenerated || !finalMessage) {
            alert("Please generate the certificate content before submitting.");
            return;
        }

        try {
            // Generate the PDF as a Blob
            const blob = await pdf(
                <CertificatePreview
                    message={finalMessage}
                    brgyOfficials={brgyOfficials}
                    certificateTitle={selectedCertificateType?.iname || ''}
                    certificateTemplate={CertificateTemplate}
                    applicant_image={formData.applicant_image}
                    controlnumber={controlNumber}
                    date={
                        formData.issuanceDate
                            ? new Date(formData.issuanceDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })
                            : new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })
                    }
                />
            ).toBlob();

            // Convert blob to a file object for FormData
            const file = new File([blob], `certificate_${Date.now()}.pdf`, { type: 'application/pdf' });

            // Prepare form data
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            formDataToSend.append('certificate', file);

            // Make API call
            const response = await axios.post(
                `http://${cfg.domainname}:${cfg.serverport}/certificate/add`,
                formDataToSend,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (response.status === 201) {
                navigate('/application-request', { state: { certificateToastType: 'Add' } });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditTextContent = (e) => {
        const newValue = e.target.value;
        setCustomPurpose(newValue);
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [customPurpose]);

    const finalMessage = overrideMessage || renderCertificateMessage;

    return (
        <div className="col-span-1 md:col-span-3 mb-4">
            {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className='flex-1'>
                    <label className="block mb-2 text-sm font-medium text-gray-500">
                        Certification Type<span className="text-red-600">*</span>
                    </label>
                    <SearchDropdown
                        onSelect={handleCertificateTypeChange}
                        selectedValue={selectedCertificateType?.iname}
                        options={certificateTypes}
                        title = "Select certification type"
                        placeholder = "Search certification type..."
                        uniqueKey={'iname'}
                    />
                </div>
                <div className='flex-1'>
                    <label className="block mb-2 text-sm font-medium text-gray-500">
                        Issuance Date<span className="text-red-600">*</span>
                    </label>
                    <input
                        type='date'
                        name="issuanceDate"
                        defaultValue={currentdate}
                        //value={formData.issuanceDate}
                        onChange={handleInputChange}
                        className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className='flex-1'>
                    <label className="block mb-2 text-sm font-medium text-gray-500">
                        Amount<span className="text-red-600">*</span>
                    </label>
                    <input
                        type='number'
                        name="amount"
                        defaultValue="50"
                        //value={formData.amount}
                        required
                        onChange={handleInputChange}
                        className="text-sm border border-gray-300 p-2 w-full text-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="">
                {renderAdditionalFields({
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
                })}
            </div>

            <div className='grid grid-cols-1'>
                <div className="flex items- justify-end space-x-2 mb-2">
                    <button
                        onClick={handleGenerateTextContent}
                        disabled={!selectedCertificateType || isGenerateButtonDisabled}
                        className={`
                            bg-blue-500 text-white px-4 py-2 rounded-md text-sm 
                            hover:bg-blue-600 
                            ${isGenerateButtonDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'}
                            ${!selectedCertificateType ? 'disabled:bg-gray-300 disabled:cursor-not-allowed' : ''}
                        `}
                    >
                        {isGenerateButtonDisabled ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                {showCustomPurpose && (
                    <>
                        <label className="block mb-2 text-sm font-medium text-gray-500">
                            Certificate text content:
                        </label>
                        <div className="relative w-full">
                            <textarea
                                ref={textareaRef}
                                className={`
                                    border text-sm border-gray-300 p-2 w-full 
                                    text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                                    ${isGenerating ? 'bg-gray-100 cursor-wait' : ''}
                                    resize-none overflow-hidden min-h-[100px]
                                `}
                                value={customPurpose}
                                onChange={handleEditTextContent}
                                disabled={isGenerating}
                                placeholder={isGenerating ? 'Generating text...' : 'Edit your purpose here'}
                            />
                            {isGenerating && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-pulse text-gray-800">
                                        Generating text...
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* {isMessageGenerated && isPreview && (
                    <PDFViewer style={{ width: '100%', height: '100vh' }}>
                        <CertificatePreview
                            message={finalMessage}
                            brgyOfficials={brgyOfficials}
                            certificateTitle={selectedCertificateType?.iname || ''}
                            date={formData.issuanceDate
                                ? new Date(formData.issuanceDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                            }
                        />
                    </PDFViewer>
                )} */}


                {isMessageGenerated && (
                    <div className="flex justify-end space-x-2 mt-4 mb-4">
                        <button
                            onClick={handleOpenPreviewInNewTab}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600"
                        >
                            Preview
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CertificationForm;