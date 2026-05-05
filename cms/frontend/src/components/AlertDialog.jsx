import React from "react";
import ReactDOM from "react-dom";

const AlertDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message,
    buttonConfig = [
        { label: "Cancel", color: "bg-gray-200 text-gray-600", action: onClose },
        { label: "Confirm", color: "bg-green-600 text-white", action: onConfirm },
    ],
}) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-5 shadow-lg max-w-sm w-full">
                {/* Title */}
                <h2 className="text-lg font-bold mb-4">{title}</h2>

                {/* Message */}
                <p className="mb-8 text-sm text-gray-500">{message}</p>

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                    {buttonConfig.map((button, index) => (
                        <button
                            key={index}
                            onClick={button.action}
                            className={`px-4 py-2 rounded text-sm ${button.color}`}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AlertDialog;
