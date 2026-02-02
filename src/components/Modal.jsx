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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                boxShadow: 'var(--shadow-lg)',
                animation: 'fadeIn 0.2s ease-out'
            }} onClick={e => e.stopPropagation()}>
                {title && (
                    <div style={{
                        padding: '1.5rem',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h3>
                        <button onClick={onClose} style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>&times;</button>
                    </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                    {children}
                </div>
            </div>
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
};

export default Modal;
