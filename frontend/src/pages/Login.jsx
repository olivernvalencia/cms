import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import cmsBackground from '../assets/cms-background.png'
import cmsLogo from '../assets/cms-logo.png'
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import cfg from '../../../server/config/config.js';

const Login = () => {
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [error, setError] = useState("");
    const [values, setValues] = useState({
        users: '',
        password: '',
    });

    const navigate = useNavigate();
    const { setBarangayId } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!values.users || !values.password) {
            setError("Email and password are required.");
            setTimeout(() => {
                setError("");
                setValues({ users: '', password: '' });
            }, 5000);
            return;
        }

        axios.post(`http://${cfg.domainname}:${cfg.serverport}/login`, values, { withCredentials: true })
            .then(res => {
                if (res.data.Status === 'Success') {
                    setValues({ users: '', password: '' });
                    setBarangayId(res.data.Id);
                    console.log(res.data.Id)
                    navigate('/home');
                } else {
                    setError(res.data.Error || "Login failed. Please try again.");
                    setValues({ users: '', password: '' });
                    setTimeout(() => {
                        setError("");
                    }, 3000);
                }
            })
            .catch(err => {
                setError("An error occurred. Please try again.");
                setValues({ users: '', password: '' });
                setTimeout(() => {
                    setError("");
                }, 3000);
                console.error(err);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{
            backgroundImage: `url(${cmsBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <div className="flex flex-col items-center justify-center bg-white max-w-96 w-full h-auto px-6 py-8 rounded-lg shadow-md">
                <div className='text-center mb-4'>
                    <img src={cmsLogo} className='w-[114px] h-[114px]' alt="logo" />
                </div>
                <h1 className="text-3xl font-bold mb-6">Login</h1>
                {
                    error &&
                    <div className='bg-red-500 p-2 mb-4 w-full text-center rounded-lg'>
                        <p className="text-white text-sm">{error}</p>
                    </div>
                }
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="relative flex items-center mb-4">
                        <MdEmail
                            className={`absolute left-3 transition-colors duration-300 ${isEmailFocused || values.users ? "text-blue-500" : "text-gray-400"}`}
                        />
                        <input
                            type="text"
                            aria-label="Email"
                            value={values.users}
                            onChange={(e) => setValues({ ...values, users: e.target.value })}
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => setIsEmailFocused(false)}
                            className="pl-10 py-2 text-sm border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md transition-colors duration-300 w-full"
                            placeholder="Email"
                        />
                    </div>

                    <div className="relative flex items-center mb-4">
                        <RiLockPasswordFill
                            className={`absolute left-3 transition-colors duration-300 ${isPasswordFocused || values.password ? "text-blue-500" : "text-gray-400"}`}
                        />
                        <input
                            type="password"
                            aria-label="Password"
                            value={values.password}
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            className="pl-10 py-2 text-sm border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md transition-colors duration-300 w-full"
                            placeholder="Password"
                        />
                    </div>

                    <Link to="/register" className="text-blue-500 mb-4">Sign Up</Link>
                    <button type="submit" className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
