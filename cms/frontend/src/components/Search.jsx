import React from 'react';
import { IoSearch } from "react-icons/io5";

const Search = ({ searchQuery, onSearchChange, placeholder = "Search Name, Household ID" }) => {
    return (
        <div className='relative max-w-96 w-full'>
            <IoSearch className='w-5 h-5 text-gray-400 absolute left-3 top-[14px]' />
            <input
                type="text"
                value={searchQuery}
                onChange={onSearchChange}
                className='rounded-full outline-none text-sm border-2 border-gray-200 text-gray-500 py-3 px-10 w-full'
                placeholder={placeholder}
            />
        </div>
    );
};

export default Search;
