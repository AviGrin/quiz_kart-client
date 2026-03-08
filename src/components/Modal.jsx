import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children, title }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div onClick={onClose}>
            <div  onClick={e => e.stopPropagation()}>
                {title && (
                    <div>
                        <h3 >{title}</h3>
                        <button onClick={onClose} >&times;</button>
                    </div>
                )}
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
