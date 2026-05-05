import React from 'react';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import CertificationForm from '../components/CertificationForm';
import Loader from '../components/Loader';
import cfg from '../../../server/config/domain.js';


const AddCertificationPage = () => {
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
                                <h1 className="text-xl font-semibold text-gray-500">Add Certification</h1>
                                <p className="text-sm text-gray-400 mt-2">
                                    Fill out the form below to add a new certificate to the system.
                                </p>
                            </div>
                            <CertificationForm />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AddCertificationPage;