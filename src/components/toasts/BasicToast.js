import React, { useEffect, useState } from 'react';

const BasicToast = ({ isOpen, message, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            setTimeout(() => setVisible(false), 500);
        }
    }, [isOpen]);

    if (!visible) return null;

    return (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#ACA0EB] text-white p-4 rounded-full shadow-lg transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex justify-between items-center">
                <span>{message}</span>
            </div>
        </div>
    );
};

export default BasicToast;
