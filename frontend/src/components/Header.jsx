import React, { useState, useEffect } from 'react';
import { TiArrowSortedDown } from "react-icons/ti";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import cmsLogo from '../assets/cms-logo.png';
import cfg from '../../../server/config/config.js';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        axios.get(`http://${cfg.domainname}:${cfg.serverport}/home`, { withCredentials: true })
            .then(res => {
                if (res.data.Status === 'Success') {
                    setUser(res.data.user);
                    setRole(res.data.role);
                } else {
                    setError(res.data.Error || 'Not authorized');
                }
            })
            .catch(err => setError('An error occurred'));
    }, []);

    const handleLogout = () => {
        axios.get(`http://${cfg.domainname}:${cfg.serverport}/logout`, { withCredentials: true })
            .then(res => {
                if (res.data.Status === "Success") {
                    navigate('/');
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center">
                <img src={cmsLogo} alt="Logo" className="h-12 w-12 mr-3" />
                <div className='leading-[1px]'>
                    <h1 className="text-xl font-semibold text-gray-600">Nspire</h1>
                    <span className='text-xs text-gray-400'>Nspire</span>
                </div>
            </div>
            <div className="flex items-center relative">
                <button
                    className="flex items-center gap-1 text-gray-600 focus:outline-none"
                    onClick={toggleDropdown}
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                >
                    <img src={cmsLogo} alt="Logo" className="h-10 w-10 object-contain mr-3" />
                    <div className='flex flex-col items-start'>
                        {user && (
                            <>
                                <p className='text-sm'>{user || 'Guest'}</p>
                                <p className="text-blue-500 text-xs">{role || 'Guest'}</p>
                            </>
                        )}
                    </div>
                    <TiArrowSortedDown className="h-4 w-4 ml-3 text-blue-500" />
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-3 top-full mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-10">
                        <div className="p-2">
                            <div className="text-gray-700 font-semibold">{user}</div>
                            <div className="text-gray-600">{role}</div> {/* Displaying role here as well */}
                        </div>
                        <div className="border-t border-gray-200"></div>
                        <button className="w-full text-left p-2 text-gray-600 hover:bg-gray-100">
                            Profile Settings
                        </button>
                        <button onClick={handleLogout} className="w-full text-left p-2 text-red-500 hover:bg-gray-100">
                            Logout
                        </button>
                    </div>
                )}
            </div>
            {error && <div className="text-red-500">{error}</div>} {/* Displaying error messages */}
        </header>
    );
};

export default Header;
