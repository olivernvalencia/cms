// Card.js
import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const Card = ({ icon, title, count, loading, borderColor, bgColor, txtColor, txtContent }) => (
    <div
        className={`px-4 py-6 bg-white rounded-md border-l-4 mb-6 md:mb-6 ${borderColor}`}
    >
        <div className={`flex items-center px-4 py-1 mb-3 rounded-full max-w-max gap-2 border-2 ${borderColor} bg-opacity-30`} style={{ backgroundColor: bgColor }}>
            {icon}
            <span className={`text-sm ${txtColor} ${borderColor.replace('border-', 'text-')}`}>{title}</span>
        </div>
        <div className='flex items-center gap-5 mb-4'>
            {loading ? (
                <span className='text-3xl text-gray-500 font-bold'>Loading...</span>
            ) : (
                <span className='text-3xl text-gray-500 font-bold'>{count}</span>
            )}
            <div className='bg-green-200 border-2 border-green-300 rounded-full px-2 py-1 max-w-max'>
                <FaChartLine className='text-green-500' />
            </div>
        </div>
        <div className='text-gray-500'>
            <span className='text-sm'>{txtContent}</span>
        </div>
    </div>
);

export default Card;
