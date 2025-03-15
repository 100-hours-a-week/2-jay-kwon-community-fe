import { useState } from 'react';

const useToast = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const showToast = (msg) => {
        setMessage(msg);
        setIsOpen(true);
        setTimeout(() => {
            setIsOpen(false);
        }, 1000); // Hide toast after 3 seconds
    };

    const closeToast = () => {
        setIsOpen(false);
    };

    return {
        isOpen,
        message,
        showToast,
        closeToast,
    };
};

export default useToast;
