import React from 'react'

const Loader = ({ type = 'fixed' }) => {
    const ballColors = [
        'bg-blue-500',
        'bg-blue-300',
        'bg-blue-500',
        'bg-blue-300',
        'bg-blue-500'
    ];

    const containerClass = type === 'fixed'
        ? 'fixed inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-center z-50'
        : 'block flex justify-center items-center z-50 h-[80%]';

    return (
        <div className={containerClass}>
            <div className="backdrop-blur-md p-8 rounded-xl flex flex-col items-center">
                <div className="grid grid-cols-5 gap-2.5 justify-center items-center mb-4">
                    {ballColors.map((color, index) => (
                        <div
                            key={index}
                            className={`w-5 h-5 rounded-full ${color} animate-bounce`}
                            style={{
                                animationDelay: `${-0.2 * index}s`
                            }}
                        />
                    ))}
                </div>
                <p className="text-gray-600 text-lg font-medium tracking-wider">Just a moment, we're fetching your data.</p>
            </div>
        </div>
    );
};

export default Loader;
