import React from 'react';


const Button = ({ text, onClick, disabled, variant = 'primary', type = 'button', className }) => {
    const baseStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        fontWeight: '600',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
        width: 'auth',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--primary)',
            color: '#fff',
        },
        secondary: {
            backgroundColor: 'var(--surface)',
            color: 'var(--text-main)',
            border: '1px solid var(--border)',
        },
        danger: {
            backgroundColor: 'var(--error)',
            color: '#fff',
        }
    };

    const style = {
        ...baseStyle,
        ...variants[variant],
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...((disabled) ? {} : { transform: 'translateY(0)' }), // Placeholder for potential hover effects controlled by CSS usually
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={style}
            className={className}
            onMouseOver={(e) => {
                if (!disabled && variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
            }}
            onMouseOut={(e) => {
                if (!disabled && variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--primary)';
            }}
        >
            {text}
        </button>
    );
};

export default Button;
