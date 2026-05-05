import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter(x => x);

    const isEncryptedId = (str) => {
        return str && str.startsWith('U2') && str.length > 30;
    };

    const filteredPathnames = pathnames.filter(value => !isEncryptedId(value));

    return (
        <nav className="breadcrumb mb-5">
            <ul className="flex space-x-2">
                {filteredPathnames[0] === "home" ? (
                    <li>
                        <Link to="/home" className="text-blue-500 hover:underline">
                            Dashboard
                        </Link>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link to="/home" className="text-blue-500 hover:underline">
                                Dashboard
                            </Link>
                        </li>
                        {filteredPathnames.length > 0 && <span className="mx-2">/</span>}

                        {filteredPathnames.map((value, index) => {
                            const routeTo = `/${filteredPathnames.slice(0, index + 1).join("/")}`;
                            const isLast = index === filteredPathnames.length - 1;

                            return (
                                <li key={index}>
                                    {isLast ? (
                                        <span className="text-gray-500">
                                            {value
                                                .split('-')
                                                .map((word, i) =>
                                                    i === 0
                                                        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                                        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                                )
                                                .join(' ')}
                                        </span>
                                    ) : (
                                        <Link to={routeTo} className="text-blue-500 hover:underline">
                                            {value
                                                .split('-')
                                                .map((word, i) =>
                                                    i === 0
                                                        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                                        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                                )
                                                .join(' ')}
                                        </Link>
                                    )}
                                    {!isLast && <span className="ml-2">/</span>}
                                </li>
                            );
                        })}
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;