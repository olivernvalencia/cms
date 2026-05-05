import React, { useState, useEffect } from 'react';

import Puroks from './Puroks';
import BarangayCouncil from './BarangayCouncil';
import CertificationPermit from './CertificationPermit';

import Tabs from '../components/Tabs';
import Breadcrumbs from '../components/Breadcrumbs'

const MasterDataPage = () => {
    const [activeTab, setActiveTab] = useState('Street/Subdivision Address');

    return (
        <div className="flex-grow p-6 bg-gray-100">
            <Breadcrumbs />
            <Tabs id="masterDataActiveTab" tabs={[
                { label: "Purok", content: <Puroks /> },
                { label: "Barangay Council", content: <BarangayCouncil /> },
                { label: "Certification & Permit", content: <CertificationPermit /> },
            ]} />
        </div>
    )

}


export default MasterDataPage;
