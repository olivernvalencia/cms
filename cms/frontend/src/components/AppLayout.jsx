import React from 'react'
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const AppLayout = ({ children }) => {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row flex-grow">
                <Sidebar />
                <main className="flex-grow p-4 bg-gray-100">
                    {children}
                </main>
            </div>
        </div>)
}

export default AppLayout