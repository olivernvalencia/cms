import React, { useEffect, useState } from 'react';

const SuccessMessage = ({ message, isVisible, variant }) => {

    const variantStyles = {
        delete: 'bg-red-100 border border-red-400 text-red-700',
        default: 'bg-green-100 border border-green-400 text-green-700'
    };

    return (
        <div
            className={`fixed right-8 top-28 ${variantStyles[variant] || variantStyles.default} 
                            px-4 py-3 rounded mb-4
                            transform transition-transform duration-500 ease-in-out
                            ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            style={{
                transitionProperty: 'transform, opacity',
                transitionDuration: isVisible ? '500ms' : '800ms',
            }}
        >
            {message}
        </div>
    );
};

export default SuccessMessage;