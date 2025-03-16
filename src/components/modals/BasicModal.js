import React from 'react';

const BasicModal = ({ isOpen, title, message, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-12 rounded-lg shadow-lg text-center w-4/5 max-w-md">
                <h3 className="text-xl font-semibold mb-4">{title}</h3>
                <p className="mb-6">{message}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={onClose} className="w-24 h-10 bg-gray-800 text-white rounded-lg font-bold hover:bg-black">취소</button>
                    <button onClick={onConfirm} className="w-24 h-10 bg-[#ACA0EB] text-black rounded-lg font-bold hover:bg-[#7F6AEE]">확인</button>
                </div>
            </div>
        </div>
    );
};

export default BasicModal;
