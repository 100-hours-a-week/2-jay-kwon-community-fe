import { useState } from 'react';

const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    const openModal = (title, message) => {
        setModalContent({ title, message });
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsOpen(false);
        document.body.style.overflow = '';
    };

    return {
        isOpen,
        modalContent,
        openModal,
        closeModal,
    };
};

export default useModal;
